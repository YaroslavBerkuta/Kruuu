/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
import { SIGNATURE_BYTES_LENGTH } from '../../../../../src/app/modules/freelancing/constants/validation';
import {
	chainspace,
	employerDid,
	employerDidDocument,
	talent1Did,
	talent1DidDocument,
} from './account';
import { projectDid } from './project';

export const mockedGetConfig = jest.fn();
export const mockedAuthorize = jest.fn();
export const mockedGetNextAvailableIndex = jest.fn();
export const mockedCreate = jest.fn();
export const mockedGetNonce = jest.fn();
export const mockedIncrementNonce = jest.fn();
export const mockedRead = jest.fn();
export const mockedAddKeys = jest.fn();

export const didMethodMock = {
	getConfig: () => {
		mockedGetConfig();
		return { chainspace };
	},
	// eslint-disable-next-line consistent-return
	authorize: async (_arg1, _arg2, _arg3): Promise<any> => {
		mockedAuthorize();
		if (_arg2 === employerDid) return [{ type: 'controller', relationship: ['authentication'] }];
		if (_arg2 === projectDid) {
			if (
				_arg3.signature !== undefined &&
				Buffer.compare(Buffer.alloc(SIGNATURE_BYTES_LENGTH), _arg3.signature as any) !== 0
			) {
				return [{ type: 'controller', relationship: ['authentication'] }];
			}
			return [];
		}
		if (_arg2 === talent1Did) {
			if (
				_arg3.signature !== undefined &&
				Buffer.compare(Buffer.alloc(SIGNATURE_BYTES_LENGTH), _arg3.signature as any) !== 0
			) {
				return [{ type: 'controller', relationship: ['authentication'] }];
			}
			return [];
		}
	},
	create: async () => {
		mockedCreate();
	},
	getNonce: async () => {
		mockedGetNonce();
		return { nonce: '0' };
	},
	incrementNonce: async () => {
		mockedIncrementNonce();
	},
	// eslint-disable-next-line consistent-return
	read: async (_arg1, _arg2): Promise<any> => {
		mockedRead();
		if (_arg2 === employerDid) return employerDidDocument;
		if (_arg2 === talent1Did) return talent1DidDocument;
	},
	addKeys: async () => {
		mockedAddKeys();
	},
};

export const freelancingMethodMock = {
	getNextAvailableIndex: async () => {
		mockedGetNextAvailableIndex();
		return BigInt(0);
	},
};
