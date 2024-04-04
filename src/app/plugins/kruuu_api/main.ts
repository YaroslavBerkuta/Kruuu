import { NestFactory } from '@nestjs/core';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import RawBodyMiddleware from './domain/stripe/middleware';
import { DomainExceptionsFilter } from './shared';

export const bootstrap = async (port: number) => {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: { excludeExtraneousValues: true },
		}),
	);

	app.use(RawBodyMiddleware());

	app.enableCors({
		origin: '*',
	});

	app.use(
		'/docs',
		basicAuth({
			challenge: true,
			users: {
				admin: '1065473nbgl',
			},
		}),
	);

	app.useGlobalFilters(new DomainExceptionsFilter(new Logger()));

	const config = new DocumentBuilder()
		.setTitle('Kruuu Api')
		.setDescription('The Kruuu API description')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(port);

	return app;
};
