import { ExceptionKeys } from '../enums';
import { DomainException } from './domain.exception';

export class WrongOTPException extends DomainException {
	constructor(description = 'Wrong one time password') {
		super({ description, key: ExceptionKeys.WrongOTP });
	}
}
