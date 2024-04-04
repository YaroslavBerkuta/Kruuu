export function createPagination(
	length: bigint,
	offset?: number,
	limit?: number,
	version?: number,
) {
	const v = BigInt(version === undefined || Number(version) === 0 ? length : Number(version));
	const o = BigInt(offset ?? 0) + (length - v);

	let l = BigInt(0);
	if (limit === undefined) {
		l = length - o;
	} else if (BigInt(limit) + o > length) {
		l = length;
	} else {
		l = BigInt(limit);
	}

	const c = o + l > length ? length : o + l;
	return { v, o, l, c };
}
