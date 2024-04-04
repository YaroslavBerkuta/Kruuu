import { Response } from 'express';
import { json } from 'body-parser';
import { RequestWithRawBody } from '../typing';

function RawBodyMiddleware() {
	return json({
		verify: (request: RequestWithRawBody, _: Response, buffer: Buffer) => {
			if (request.url === '/stripe/webhook' && Buffer.isBuffer(buffer)) {
				return (request.rawBody = Buffer.from(buffer));
			}
			return true;
		},
	});
}

export default RawBodyMiddleware;
