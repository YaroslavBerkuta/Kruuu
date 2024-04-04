import { cryptography } from 'lisk-sdk';

export const privateKey = Buffer.from(
	'96238e3e3e4e1c31321b4ad2cd88dcd3a6e14fc11a82c11f6c3e63272a1768ff330606ae444531582beaad5891c5733ce16ea19768be5a8a45ae10fea99f2032',
	'hex',
);
export const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);
export const address = cryptography.address.getAddressFromPublicKey(publicKey);
