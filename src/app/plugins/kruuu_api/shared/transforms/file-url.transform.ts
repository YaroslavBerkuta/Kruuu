import { getEnv } from '../helpers';
import Imgproxy from 'imgproxy';

const imgproxy = new Imgproxy({
	baseUrl: getEnv('IMGPROXY_BASE_URL'),
	key: getEnv('IMGPROXY_KEY'),
	salt: getEnv('IMGPROXY_SALT'),
	encode: true,
});

const imgproxyActive = process.env['IMGPROXY_ACTIVE'];

export const transformFileUrl = (url: string) => {
	if (!url) return null;

	if (isOtherFolder(url)) return `${getEnv('MINIO_FILES_URL_PREFIX')}/${url}`;

	const originalUrl = `${getEnv('MINIO_URL_PREFIX')}/${url}`;

	if (imgproxyActive === 'false') return originalUrl;

	try {
		return imgproxy.builder().resize('fill', 500, 500, false).generateUrl(originalUrl);
	} catch (e) {
		return originalUrl;
	}
};

const isOtherFolder = (url: string) => {
	const otherFolderUrl = `${getEnv('MINIO_BUCKET')}/other`;
	return url.includes(otherFolderUrl);
};
