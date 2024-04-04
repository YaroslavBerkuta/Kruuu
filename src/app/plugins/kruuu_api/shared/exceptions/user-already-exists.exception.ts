import { ExceptionKeys } from '../enums';
import { DomainException } from './domain.exception';

export class UserAlreadyExistsException extends DomainException {
	constructor(description = 'User already exists') {
		super({ description, key: ExceptionKeys.UserAlreadyExists });
	}
}
