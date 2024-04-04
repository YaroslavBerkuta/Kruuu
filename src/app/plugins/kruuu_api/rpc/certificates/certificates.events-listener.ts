import { Inject, Injectable } from '@nestjs/common';
import { BlockListener } from '~api/shared';
import { DecodedEventJSON } from '@liskhq/lisk-api-client/dist-node/types';
import * as lvc from '@lisk-did/lisk-verifiable-credentials';
import { CERTEFICATES_SERVICES, ICertificatesService } from '~api/domain/certificates/typing';

@Injectable()
export class CertificatesEventsListener extends BlockListener {
	protected listenModule = 'vc';

	@Inject(CERTEFICATES_SERVICES)
	private readonly certeficationService: ICertificatesService;

	protected async onEvent(eventData: DecodedEventJSON) {
		try {
			console.log(eventData.name);
			// console.log(eventData);
			if (eventData.name === 'vCStore') this.handlevCStore(eventData);
		} catch (e) {
			console.log(e);
		}
	}

	protected async handlevCStore(eventData: DecodedEventJSON) {
		try {
			const result = lvc.codec.decodeCredential(
				Buffer.from(String(eventData.data.docBytes), 'hex') as any,
			);

			const id = result.credentialSubject.id.split(':').reverse();
			const certificateId = id[0];
			const userId = id[1];

			const relation = await this.certeficationService.certifyUser({
				userId: Number(userId),
				certeficateId: Number(certificateId),
			});

			console.log('result', relation);
		} catch (e) {
			console.log('handlevCStore', e);
		}
	}
}
