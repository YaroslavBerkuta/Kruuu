import { AccountStoreData } from 'app/modules/freelancing/stores/account';
import { did } from 'lisk-did';
import { cryptography } from 'lisk-sdk';

export const chainspace = 'kruuu';

export const employerPrivateKey = Buffer.from(
	'96238e3e3e4e1c31321b4ad2cd88dcd3a6e14fc11a82c11f6c3e63272a1768ff330606ae444531582beaad5891c5733ce16ea19768be5a8a45ae10fea99f2032',
	'hex',
);
export const employerPublicKey = cryptography.ed.getPublicKeyFromPrivateKey(employerPrivateKey);
export const employerAddress = cryptography.address.getAddressFromPublicKey(employerPublicKey);
export const employerDid = did.getAddressDIDFromPublicKey(chainspace, employerPublicKey);
export const employerAccount: AccountStoreData = {
	employerOf: [],
	talentOf: [],
};
export const employerDidDocument = did.utils.bootstrapAddressDidDocument(
	chainspace,
	employerPublicKey,
);

export const talent1PrivateKey = Buffer.from(
	'6c5544797a91115dc3330ebd003851d239a706ff2aa2ab70039c5510ddf06420a78983c418f5c15a773c5a4d6273898e80dbf9db4df65d2308b90aa2bd7d7e64',
	'hex',
);
export const talent1PublicKey = cryptography.ed.getPublicKeyFromPrivateKey(talent1PrivateKey);
export const talent1Address = cryptography.address.getAddressFromPublicKey(talent1PublicKey);
export const talent1Did = did.getAddressDIDFromPublicKey(chainspace, talent1PublicKey);
export const talent1Account: AccountStoreData = {
	employerOf: [],
	talentOf: [],
};
export const talent1DidDocument = did.utils.bootstrapAddressDidDocument(
	chainspace,
	talent1PublicKey,
);
