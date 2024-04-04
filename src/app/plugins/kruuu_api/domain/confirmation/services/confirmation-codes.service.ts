import { ForbiddenException, Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';
import { IConfirmationCodesService, TCodeReceiverCallback } from '../typing';
import { RedisService } from '~api/libs';

@Injectable()
export class ConfirmationCodesService implements IConfirmationCodesService {
	private readonly codeDuration = 600;

	constructor(private readonly redisService: RedisService) {}

	public async sendConfirmationCode(receiver: string, senderCallback: TCodeReceiverCallback) {
		const code = this.generateCode();
		await senderCallback(code);
		await this.saveCode(receiver, code);

		return code;
	}

	private generateCode(length = 4): string {
		return randomstring.generate({ length, charset: 'numeric' });
	}

	private async saveCode(receiver: string, code: string) {
		await this.redisService.set(this.addPrefix(receiver), code, this.codeDuration);
	}

	public async confirmCode(receiver: string, code: string) {
		const isCorrect = await this.compareCode(receiver, code);

		if (isCorrect) await this.deleteCode(receiver);

		return isCorrect;
	}

	public async compareCode(receiver: string, code: string) {
		const savedCode = await this.getCode(receiver);
		if (savedCode !== code) {
			throw new ForbiddenException('code not valid');
		}
		return savedCode == code;
	}

	private async deleteCode(receiver: string) {
		return await this.redisService.del(this.addPrefix(receiver));
	}

	private async getCode(receiver: string) {
		return await this.redisService.get(this.addPrefix(receiver));
	}

	private addPrefix(receiver: string) {
		return `receiver-${receiver}`;
	}
}
