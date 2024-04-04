import { ExceptionKeys } from '../enums';
import { DomainException } from './domain.exception';

export class WrongRefreshTokenException extends DomainException {
	constructor(description = 'Wrong refresh token') {
		super({ description, key: ExceptionKeys.WrongRefreshToken });
	}
}
