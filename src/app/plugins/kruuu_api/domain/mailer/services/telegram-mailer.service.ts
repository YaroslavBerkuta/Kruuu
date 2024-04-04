import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TELEGRAM_API_URL, TELEGRAM_BOT_API_KEY, TELEGRAM_CHANEL_ID } from '../config';
import { InvalidCredentialsException } from '~api/shared';
import { IMailerService, ISendPayload } from '../typing';

@Injectable()
export class TelegramMailerService implements IMailerService {
	public async send(options: ISendPayload) {
		const telegramMessage = `
                <b>EMAIL</b>
								<b>From: <i>KRUUU</i></b>
                <b>Send to email: <i>${options.to}</i></b>
								<b>Subject: <i>${options.subject}</i></b>
                Message: ${options.text}
                `;

		try {
			await this.sendMessageToChanel(telegramMessage);
		} catch (e) {
			console.log('Send email errors', e);
			throw new InvalidCredentialsException(`Can\'t send an email to ${options.to}`);
		}
	}

	private getTelegramUrl = () => {
		return `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_API_KEY}/sendMessage`;
	};

	private sendMessageToChanel = (message: string) => {
		return axios.post(
			this.getTelegramUrl(),
			{},
			{
				params: {
					chat_id: TELEGRAM_CHANEL_ID,
					text: message,
					parse_mode: 'html',
				},
			},
		);
	};
}
