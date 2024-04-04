import { StoreVCCommandParams } from 'app/modules/vc/commands/store_command';

export const validParam: StoreVCCommandParams = {
	id: 'urn:sha256:be5c8e26a60b911370b30dcef6a9f497de0805efc30827c51fb354f766be2261',
	docBytes: Buffer.from(
		'96238e3e3e4e1c31321b4ad2cd88dcd3a6e14fc11a82c11f6c3e63272a1768ff330606ae444531582beaad5891c5733ce16ea19768be5a8a45ae10fea99f2032',
		'hex',
	),
};
