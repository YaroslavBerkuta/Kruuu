import { ExceptionKeys } from '../enums';
import { DomainException } from './domain.exception';

export class InvalidCredentialsException extends DomainException {
	constructor(description = 'Invalid credentials') {
		super({ description, key: ExceptionKeys.InvalidCredentials });
	}
}
