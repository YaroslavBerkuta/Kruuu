import { DomainErrorParams } from '../interfaces';

export class DomainException {
	constructor(private readonly params: DomainErrorParams) {}

	public getParams() {
		return this.params;
	}
}
