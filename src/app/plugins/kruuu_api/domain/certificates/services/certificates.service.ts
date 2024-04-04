import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	CERTEFICATE_TO_USER_REPOSITORY,
	CERTEFICATES_REPOSITORY,
	ICertificatesService,
	ICertifyUserPayload,
	ICerteficatesToUserRepository,
	ICertificatesRepository,
	ICreateCertificatePayload,
} from '../typing';

@Injectable()
export class CertificatesService implements ICertificatesService {
	@Inject(CERTEFICATES_REPOSITORY)
	private readonly certeficationRepository: ICertificatesRepository;

	@Inject(CERTEFICATE_TO_USER_REPOSITORY)
	private readonly certeficateToUserRepository: ICerteficatesToUserRepository;

	public async create(payload: ICreateCertificatePayload) {
		try {
			const certeficat = await this.certeficationRepository.save(payload);
			return certeficat;
		} catch (error) {
			console.log(error);
			throw new Error('something went wrong');
		}
	}

	public async certifyUser(payload: ICertifyUserPayload) {
		try {
			const existCerteficat = await this.certeficationRepository.findOneBy({
				id: payload.certeficateId,
			});

			if (!existCerteficat) throw new NotFoundException('certeficate not found');

			const exist = await this.certeficateToUserRepository.findOneBy({
				certeficateId: payload.certeficateId,
				userId: payload.userId,
			});
			if (exist) return;

			await this.certeficateToUserRepository.save({
				certeficateId: payload.certeficateId,
				userId: payload.userId,
			});
		} catch (error) {
			console.log(error);
			throw new Error('something went wrong');
		}
	}
}
