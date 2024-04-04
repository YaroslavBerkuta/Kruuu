import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { WrongRefreshTokenException, NotFoundException } from '~api/shared';
import { In } from 'typeorm';
import {
	ISession,
	ISessionsRepository,
	ISessionsService,
	IStartSessionPayload,
	SESSIONS_REPOSITORY,
} from '../typing';
import { JwtService, RedisService } from '~api/libs';
import { UserRole } from '~api/domain/users/typing';

@Injectable()
export class SessionsService implements ISessionsService {
	@Inject(SESSIONS_REPOSITORY) private readonly sessionsRepository: ISessionsRepository;

	constructor(
		private readonly jwtService: JwtService,
		private readonly redisService: RedisService,
	) {}

	public async start(payload: IStartSessionPayload) {
		const session: ISession = {
			accessToken: ' ',
			refreshToken: ' ',
			deviceName: payload.deviceName,
			type: payload.type,
			userId: payload.userId,
		};
		const resultInsert = await this.sessionsRepository.insert(session);
		const sessionId = resultInsert.identifiers[0].id;

		const tokens = this.generateTokens(payload.userId, payload.role, sessionId);

		await this.sessionsRepository.update(sessionId, tokens);

		return {
			...session,
			...tokens,
		};
	}

	public async getByUserId(userId: number) {
		return await this.sessionsRepository.findBy({ userId });
	}

	public async refresh(refreshToken: string) {
		const session = await this.sessionsRepository.findOneBy({ refreshToken });

		if (!session) throw new WrongRefreshTokenException();

		const decoded = this.jwtService.decodeToken(refreshToken);
		const tokens = this.generateTokens(session.userId, decoded.role, session.id);

		await this.sessionsRepository.save({
			id: session.id,
			userId: session.userId,
			...tokens,
		});

		return tokens;
	}

	public async getSessionsByTokens(refreshTokens: string[], selectFields?: string[]) {
		if (!_.isArray(refreshTokens) || !refreshTokens.length) return [];

		const query = this.sessionsRepository
			.createQueryBuilder('it')
			.where('it.refreshToken = ANY(:refreshTokens)', { refreshTokens });

		if (!_.isEmpty(selectFields)) {
			query.select(_.map(selectFields, it => `it.${it}`));
		}

		return query.getMany();
	}

	private generateTokens(userId: number, role: UserRole, sessionId: number) {
		return {
			accessToken: this.jwtService.createToken({ id: userId, role, sessionId }),
			refreshToken: this.jwtService.createToken({
				id: `_${userId}`,
				role,
				sessionId,
				expiresIn: null,
			}),
		};
	}

	public async finish(sessionId: number) {
		const session = await this.sessionsRepository.findOneBy({ id: sessionId });
		if (!session) throw new NotFoundException('Sessions not found');

		await this.delete(session);
	}

	public async finishByToken(token: string) {
		const session = await this.sessionsRepository
			.createQueryBuilder('it')
			.where('it.refreshToken = :token', { token })
			.orWhere('it.accessToken = :token', { token })
			.getOne();

		if (!session) throw new NotFoundException('Sessions not found');

		await this.delete(session);
	}

	private async delete(session: ISession) {
		if (session) {
			await this.storeToken(session.accessToken);
			await this.sessionsRepository.delete(session.id);
		}
	}

	public async checkTokenDeprecation(token: string) {
		const exists = await this.redisService.get(token);

		return Boolean(exists);
	}

	public async closeAllUserSessions(userId: number, excludeIds?: number[]) {
		const query = this.sessionsRepository
			.createQueryBuilder('it')
			.select(['it.id', 'it.accessToken'])
			.where('it.userId = :userId', { userId });

		if (!_.isEmpty(excludeIds)) query.andWhere('it.id <> ANY(:excludeIds)', { excludeIds });

		const sessions = await query.getMany();
		const sessionsIds = _.map(sessions, 'id');

		if (!sessions?.length) return;
		await this.sessionsRepository.delete({ id: In(sessionsIds) });
		await Promise.all(sessions.map(async it => await this.storeToken(it.accessToken)));
	}

	private async storeToken(token: string) {
		await this.redisService.set(token, 'true', 360);
	}
}
