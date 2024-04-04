export interface IGalleryModel {
	id: number;

	fileUrl: string;
	parentTable: string;
	parentId: string;
	data?: any;
	fileName?: string;
	mimetype?: string;

	createdAt: string;
	updatedAt: string;
}

export interface IGalleryService {
	store(dto: IStoreGalleryPayload): Promise<IGalleryModel>;
	delete(id: number): Promise<void>;
	get(dto: IGetGalleryParams): Promise<IGalleryModel[]>;
	associateProccessFiles(proccessId: string, newId: string, newDirectory: string): Promise<void>;
}

export interface IStoreGalleryPayload {
	fileUrl: string;
	parentTable: string;
	parentId: string | number;
	data?: any;
	fileName?: string;
	mimetype?: string;
}

export interface IGetGalleryParams {
	parentTable: string;
	parentId: string | number;
}
