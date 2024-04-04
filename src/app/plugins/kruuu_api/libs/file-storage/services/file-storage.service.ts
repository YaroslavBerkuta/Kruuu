/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Client, CopyConditions } from 'minio';
import { FILE_STORAGE_OPTIONS } from '../consts';
import { IFilesStorageOptions, IInputFile } from '../interfaces';
import { FilesStorage } from '~api/shared/namespace';
import { UPLOAD_IMAGE_FILE_TYPES } from '~api/shared';

@Injectable()
export class FileStorageService implements FilesStorage.IFilesStorageService {
	private readonly minioClient: Client;
	private readonly bucket: string = 'files';
	private readonly privateBucket: string = 'def';
	private readonly urlPrefix: string;
	private readonly isAwsStorage: boolean = false;

	constructor(@Inject(FILE_STORAGE_OPTIONS) options: IFilesStorageOptions) {
		const params: any = {
			endPoint: options.host,
			useSSL: String(options.useSSL) === 'true',
			accessKey: options.accessKey,
			secretKey: options.secretKey,
			region: options.region,
		};

		const port = Number(options.port);
		if (port) params.port = port;

		if (params.region) this.isAwsStorage = true;
		if (options.bucket) this.bucket = options.bucket;

		this.urlPrefix = options.urlPrefix;
		this.minioClient = new Client(params);
	}

	/**
	 * Формування повної адреси даного файла
	 * @param {string} folder - адреса папки, що містить файл
	 * @param {string} file - адреса файла
	 * @returns Повертає повну адресу файла
	 */
	private createFullFilePath(folder: string, file: string): string {
		return `${this.bucket}/${folder}/${file}`;
	}

	async putObject(file: IInputFile, folderPath = 'images'): Promise<string> {
		return new Promise((resolve, reject) => {
			const folder = `${folderPath}/${new Date().getFullYear()}/${new Date().getMonth()}`;
			const fileName = `${new Date().getTime()}.${file.originalname.replace(/ /g, '_')}`;

			const metaData = { 'Content-Type': 'application/octet-stream' };

			this.minioClient.putObject(
				this.bucket,
				`${folder}/${fileName}`,
				file.buffer,
				null,
				metaData,
				err => {
					if (err) {
						reject(err);
					} else resolve(this.createFullFilePath(folder, fileName));
				},
			);
		});
	}

	async copyObject(fileUrl: string, folderPath = 'images') {
		const name = this.extractOriginalName(fileUrl);
		const folder = `${folderPath}/${new Date().getFullYear()}/${new Date().getMonth()}`;
		const fileName = `${new Date().getTime()}.${name.replace(/ /g, '_')}`;
		const conditions = new CopyConditions();

		await this.minioClient.copyObject(this.bucket, `${folder}/${fileName}`, fileUrl, conditions);
		return this.createFullFilePath(folder, fileName);
	}

	extractOriginalName(fileUrl: string) {
		const attributes = fileUrl.split('/');
		const name = attributes[attributes.length - 1];
		const nameArr = name.split('.');
		const originalName = nameArr.slice(1);
		return originalName.join('.');
	}

	async safePutObject(file: IInputFile, folderPath: string): Promise<string> {
		let path: string = null;
		if (UPLOAD_IMAGE_FILE_TYPES.includes(file.mimetype)) path = `${folderPath}`;
		else path = `other/${folderPath}`;

		return this.putObject(file, path);
	}

	async removeObject(url: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.minioClient.removeObject(this.bucket, this.getKeyFromUrl(url), err => {
				console.log(err);
				if (err) return reject(false);
				return resolve(true);
			});
		});
	}

	async removeObjects(urls: string[]): Promise<void> {
		const keys = urls.map(item => this.getKeyFromUrl(item));
		return new Promise((resolve, reject) =>
			this.minioClient.removeObjects(this.bucket, keys, err => {
				if (err) return reject();
				return resolve();
			}),
		);
	}

	async saveWithTypeCheck(
		file: IInputFile,
		allowedTypes: string[],
		path?: string,
	): Promise<string> {
		if (!file?.mimetype) {
			throw new BadRequestException('File is required');
		} else if (!allowedTypes.includes(file.mimetype)) {
			throw new BadRequestException('File type is allowed');
		}
		return this.putObject(file, path);
	}

	/**
	 * Отримання назви файлу з його повної адреси
	 * @param {string} url - повна адреса файлу
	 * @returns Повертає назву файлу
	 */
	private getKeyFromUrl(url: string) {
		const toReplace = this.isAwsStorage
			? `${this.urlPrefix}/${this.bucket}/`
			: `${this.urlPrefix}/${this.bucket}`;
		return url.replace(toReplace, '');
	}

	// **********  PRIVATE BUCKET ********** //
	async putToPrivateBucket(file: IInputFile, folderPath: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const fileName = `${file.originalname.replace(/ /g, '_')}`;
			const metaData = { 'Content-Type': 'text/plain' };

			this.minioClient.putObject(
				this.privateBucket,
				`${folderPath}/${fileName}`,
				file.buffer,
				null,
				metaData,
				err => {
					if (err) reject();
					else resolve();
				},
			);
		});
	}

	async getFromPrivateBucket(name: string, folderPath: string) {
		return new Promise((resolve, reject) => {
			const fileName = `${name.replace(/ /g, '_')}`;

			return this.minioClient.getObject(
				this.privateBucket,
				`${folderPath}/${fileName}`,
				(err, res) => {
					if (err) {
						console.log('error on resp', err);
						reject(err);
					}
					res.on('data', chunk => resolve(chunk));
				},
			);
		});
	}

	async getPresignedUrlForPutObject(folderPath = 'images', filename: string) {
		const folder = `${folderPath}/${new Date().getFullYear()}/${new Date().getMonth()}`;
		const fileName = `${new Date().getTime()}.${filename.replace(/ /g, '_')}`;
		const presignedUrl = await this.minioClient.presignedPutObject(
			this.bucket,
			`${folder}/${fileName}`,
		);
		return { presignedUrl, resultUrl: this.createFullFilePath(folder, fileName) };
	}
}
