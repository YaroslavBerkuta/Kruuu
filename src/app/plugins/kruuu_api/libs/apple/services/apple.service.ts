import { Inject, Injectable } from '@nestjs/common';
import appleSignin from 'apple-signin-auth';
import { IAppleModuleParams } from '../interfaces';

@Injectable()
export class AppleService {
	constructor(@Inject('APPLE_MODULE_PARAMS') private params: IAppleModuleParams) {}

	public async getAppleUserIdByToken(token: string): Promise<string> {
		try {
			const { sub: userAppleId } = await appleSignin.verifyIdToken(token, {
				audience: this.params.appleAppId,
				ignoreExpiration: true, // ignore token expiry (never expires)
			});
			return userAppleId;
		} catch (e) {
			return null;
		}
	}
}
