import { ExceptionKeys } from '../enums';
import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
	constructor(description = 'Not found') {
		super({ description, key: ExceptionKeys.NotFound });
	}
}
