import { serializer } from '../../../../../src/app/modules/freelancing/utils/serializer';

const buf = Buffer.from(
	'96238e3e3e4e1c31321b4ad2cd88dcd3a6e14fc11a82c11f6c3e63272a1768ff330606ae444531582beaad5891c5733ce16ea19768be5a8a45ae10fea99f2032',
	'hex',
);
const data = {
	string: 'string',
	number: 1,
	bigint: BigInt(1),
	buffer: buf,
	stringArr: ['string'],
	numberArr: [1],
	bigintArr: [BigInt(1)],
	bufferArr: [buf],
};

describe('serializer', () => {
	let dup = { ...data };

	beforeEach(() => {
		dup = { ...data };
	});

	it('should serialize undefined to undefined', () => {
		const ser = serializer(undefined);
		expect(ser).toBeUndefined();
	});

	it('should serialize bigint to string', () => {
		const ser = serializer(dup);
		expect(typeof ser.bigint).toBe('string');
	});

	it('should serialize bigint arr to string arr', () => {
		const ser = serializer(dup);
		expect(ser.bigintArr).toStrictEqual(['1']);
	});

	it('should serialize buffer to string', () => {
		const ser = serializer(dup);
		expect(typeof ser.buffer).toBe('string');
		expect(ser.buffer).toBe(buf.toString('hex'));
	});

	it('should serialize buffer arr to string arr', () => {
		const ser = serializer(dup);
		expect(ser.bufferArr).toStrictEqual([buf.toString('hex')]);
	});
});
