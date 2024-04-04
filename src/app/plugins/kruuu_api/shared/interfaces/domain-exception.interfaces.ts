import { ExceptionKeys } from '../enums';

export interface DomainErrorParams {
	key: ExceptionKeys;
	description: string;
}
