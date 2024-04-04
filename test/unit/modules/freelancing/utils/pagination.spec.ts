import { createPagination } from '../../../../../src/app/modules/freelancing/utils/pagination';

describe('createPagination', () => {
	let length: bigint;
	let offset: number;
	let limit: number;
	let version: number;

	beforeEach(() => {
		length = BigInt(10);
		offset = 5;
		limit = 5;
		version = 10;
	});

	it('should return version (v), offset (o), limit (l), and count (c)', () => {
		const { v, o, l, c } = createPagination(length, offset, limit, version);

		expect(Number(v)).toBe(version);
		expect(Number(o)).toBe(offset);
		expect(Number(l)).toBe(limit);
		expect(Number(c)).toBe(Number(length));
	});

	it('should use length as version if not provided', () => {
		const { v, o, l, c } = createPagination(length, offset, limit);

		expect(Number(v)).toBe(version);
		expect(Number(o)).toBe(offset);
		expect(Number(l)).toBe(limit);
		expect(Number(c)).toBe(Number(length));
	});

	it('should adjust offset according to version', () => {
		version = 8;
		const { o } = createPagination(length, offset, limit, version);
		expect(Number(o)).toBe(offset + (Number(length) - version));
	});

	it('should clamp limit if offset is exceeting length', () => {
		offset = 100;
		const { l } = createPagination(length, offset, limit, version);
		expect(Number(l)).toBe(Number(length));
	});
});
