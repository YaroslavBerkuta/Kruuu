import { Inject, Injectable } from '@nestjs/common';
import { IGoogleUserData, IGoogleModuleParams } from '../interfaces';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
	private client: OAuth2Client;

	constructor(
		@Inject('GOOGLE_MODULE_PARAMS')
		private params: IGoogleModuleParams,
	) {
		this.client = new OAuth2Client(params.clientId);
	}

	async getGoogleUserIdByToken(token: string): Promise<IGoogleUserData> {
		const ticket = await this.client.verifyIdToken({
			idToken: token,
			audience: this.params.clientId,
		});

		const payload = ticket.getPayload();

		return payload
			? {
					id: payload.sub,
					email: payload.email,
			  }
			: null;
	}
}
