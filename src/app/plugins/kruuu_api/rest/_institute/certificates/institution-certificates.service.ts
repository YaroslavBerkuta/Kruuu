import { Inject, Injectable } from '@nestjs/common';
import {
	CERTEFICATE_TO_USER_REPOSITORY,
	CERTEFICATES_REPOSITORY,
	CERTEFICATES_SERVICES,
	ICerteficateToUser,
	ICertificatesService,
	ICertificate,
	ICerteficatesToUserRepository,
	ICertificatesRepository,
} from '~api/domain/certificates/typing';
import { CertifyUserPayloadDto, SaveCerteficatDto } from './dto';
import { IPagination, paginateAndGetMany } from '~api/shared';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import { ITalentsInfoRepository, TALENTS_INFO_REPOSITORY } from '~api/domain/talents/typing';
import { isEmpty, uniq } from 'lodash';
import { plainToInstance } from 'class-transformer';
import { ITagsService, TAGS_SERVICE, TagDto } from '~api/domain/tags/typing';

import * as lvc from '@lisk-did/lisk-verifiable-credentials';
import * as ldid from '@lisk-did/lisk-decentralized-identifier';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';
import { IUsersRepository, USERS_REPOSITORY } from '~api/domain/users/typing';
import { cryptography } from 'lisk-sdk';

@Injectable()
export class InstituteCertificatesService {
	@Inject(CERTEFICATES_SERVICES)
	private readonly certeficationService: ICertificatesService;

	@Inject(CERTEFICATES_REPOSITORY)
	private readonly certeficationRepository: ICertificatesRepository;

	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;

	@Inject(CERTEFICATE_TO_USER_REPOSITORY)
	private readonly certeficateToUserRepository: ICerteficatesToUserRepository;

	@Inject(TALENTS_INFO_REPOSITORY)
	private readonly talentInfoRepository: ITalentsInfoRepository;

	@Inject(TAGS_SERVICE)
	private readonly tagsService: ITagsService;

	@Inject(USERS_REPOSITORY)
	private readonly usersRepository: IUsersRepository;

	@Inject(BLOCK_API_SERVICE)
	private readonly blockApi: IBlockApiService;

	async storeCerteficate(userId: number, dto: SaveCerteficatDto) {
		const certeficat = await this.certeficationService.create({ userId, ...dto });
		return certeficat;
	}

	async getList(userId: number, pagination: IPagination) {
		const query = this.certeficationRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.certeficateToUser', 'ctu')
			.where('it.userId = :userId', { userId })
			.orderBy('it.createdAt', 'DESC');

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (it: ICertificate, index: number, arr: ICertificate[]) => {
				arr[index].files = await this.galleryService.get({
					parentId: it.id,
					parentTable: 'certifications',
				});
			}),
		);

		return { items, count };
	}

	async getCertifyUsers(userId: number, pagination: IPagination, certeficateId: number) {
		try {
			const query = this.certeficateToUserRepository
				.createQueryBuilder('it')
				.leftJoinAndSelect('it.certeficate', 'certeficate')
				.leftJoin('it.user', 'user')
				.where('certeficate.userId = :userId', { userId });

			if (certeficateId) {
				query.where('it.certeficateId = :certeficateId', { certeficateId });
			}

			const { items, count } = await paginateAndGetMany(query, pagination, 'it');

			await Promise.all(
				items.map(async (it: ICerteficateToUser, index, arr: any) => {
					arr[index].info = await this.talentInfoRepository.findOne({
						where: { userId: it.userId },
					});
					arr[index].image = await this.galleryService.get({
						parentId: it.userId,
						parentTable: 'talents',
					});
				}),
			);

			return { items: await this.prepareItems(items), count };
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async certifyUser(userId: number, dto: CertifyUserPayloadDto) {
		const certificate = await this.certeficationRepository.findOneBy({ id: dto.certeficateId });
		const talent = await this.usersRepository.findOneBy({ id: dto.userId });

		const privateKey = await this.blockApi.getUserPrivateKey(userId);
		const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);

		const credential = {
			'@context': [
				'https://www.w3.org/2018/credentials/v1',
				'https://gitlab.com/kruuu1/kruuu-core/-/raw/main/src/app/modules/vc/KruuuCredentialContext.jsld',
			],
			type: ['VerifiableCredential', 'KruuuCredential'],
			issuer: ldid.getAddressDIDFromPublicKey('kruuu', publicKey), // => `did:lisk:kruuu:address:lskm9tzyzcp48bq394xfzt2xpan6jhbuossh7kj4t`
			credentialSubject: {
				id: `urn:uuid:${talent.id}:${certificate.id}`, // => needs to be in URI format
				title: certificate.title,
				startingDate: certificate.startDate,
				duration: `${certificate.durationTime}:${certificate.durationTerm}`,
				location: certificate.location,
				description: certificate.descriptions,
				image: !isEmpty(certificate.files) ? certificate.files[0].fileUrl : '',
			},
		};

		const options = { ipc: '~/.lisk/kruuu-core' };
		const signedVC = await lvc.issueCredential(credential, privateKey, options);
		const encodedSignedVC = lvc.codec.encodeCredential(signedVC);

		await this.blockApi.createUserSignedTx(userId, {
			module: 'vc',
			command: 'store',
			fee: '0',
			params: {
				id: signedVC.id,
				docBytes: encodedSignedVC,
			},
		});
	}

	private async prepareItems(items: any[]) {
		if (isEmpty(items)) return items;

		const tagIds = [];
		items.map(it => {
			if (it.info.mainOccupTagId) tagIds.push(it.info.mainOccupTagId);
			if (it.info.secondOccupTagId) tagIds.push(it.info.secondOccupTagId);
		});
		if (isEmpty(tagIds)) return items;

		const tags = await this.tagsService.getByIds(uniq(tagIds));
		items.map(
			it =>
				(it.info.tags = plainToInstance(
					TagDto,
					tags.filter(
						tag => tag.id === it.info.mainOccupTagId || tag.id === it.info.secondOccupTagId,
					),
				)),
		);

		return items;
	}
}
