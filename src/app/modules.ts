/* eslint-disable @typescript-eslint/no-empty-function */
import { DidModule } from 'lisk-did';
import {
	Application,
	AuthMethod,
	DynamicRewardMethod,
	FeeMethod,
	MainchainInteroperabilityMethod,
	PoSMethod,
	RandomMethod,
	SidechainInteroperabilityMethod,
	TokenMethod,
	ValidatorsMethod,
} from 'lisk-sdk';
import { FreelancingModule } from './modules/freelancing/module';
import { VcModule } from './modules/vc/module';

interface LiskMethod {
	validator: ValidatorsMethod;
	auth: AuthMethod;
	token: TokenMethod;
	fee: FeeMethod;
	random: RandomMethod;
	reward: DynamicRewardMethod;
	pos: PoSMethod;
	interoperability: SidechainInteroperabilityMethod | MainchainInteroperabilityMethod;
}

export const registerModules = (_app: Application, _method: LiskMethod): void => {
	const freelancingModule = new FreelancingModule();
	const didModule = new DidModule();

	freelancingModule.addDependencies(didModule.method);

	_app.registerModule(freelancingModule);
	_app.registerModule(didModule);
	_app.registerModule(new VcModule());
};
