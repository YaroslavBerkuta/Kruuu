import { Inject, Injectable } from '@nestjs/common';
import {
	IGetTagsListParams,
	IStoreTagPayload,
	ITagsRepository,
	ITagsService,
} from '../typing/interfaces';
import * as _ from 'lodash';
import { NotFoundException } from '~api/shared';
import { Brackets, In } from 'typeorm';
import { TAGS_REPOSITORY } from '../typing';

@Injectable()
export class TagsService implements ITagsService {
	@Inject(TAGS_REPOSITORY) private readonly tagsRepository: ITagsRepository;

	public async store(payload: IStoreTagPayload) {
		const query = this.tagsRepository
			.createQueryBuilder('it')
			.where('it.category = :category', { category: payload.category })
			.andWhere('it.name = :name', { name: payload.name });
		if (payload.key) query.andWhere('it.key = :key', { key: payload.key });
		if (payload.parentId) query.andWhere('it.parentId = :parentId', { parentId: payload.parentId });

		const existTag = await query.getOne();
		if (existTag) return existTag;

		if (payload.parentKey) {
			let parent = await this.tagsRepository.findOne({ where: { key: payload.parentKey } });
			while (!parent)
				parent = await this.tagsRepository.findOne({ where: { key: payload.parentKey } });
			payload.parentId = parent.id;
		}

		if (payload.parentId) await this.validateParentId(payload.parentId);

		return this.tagsRepository.save(payload);
	}

	private async validateParentId(parentId: number) {
		if (_.isNil(parentId)) return;
		const parent = await this.tagsRepository.findOneBy({ id: parentId });

		if (!parent) throw new NotFoundException('Parent not found');
	}

	public async getTreeLikeListOfAll(parentId: number = null) {
		const list = await this.getAllChildren(parentId);

		await Promise.all(
			list.map(async it => {
				it.children = await this.getTreeLikeListOfAll(it.id);
			}),
		);

		return list;
	}

	public async getAllChildren(id: number) {
		return await this.tagsRepository.findBy({ parentId: id, isCustom: false });
	}

	public async getByIds(ids: number[]) {
		return this.tagsRepository.findBy({ id: In(ids) });
	}

	public async getList(params: IGetTagsListParams) {
		const query = this.tagsRepository.createQueryBuilder('it');

		if (params.category) query.andWhere('it.category = :category', { category: params.category });

		if (params.userId) {
			query.andWhere(
				new Brackets(subQuery => {
					subQuery.where(
						new Brackets(subQuery2 => {
							subQuery2.where('it.isCustom = :isCustom', { isCustom: true });
							subQuery2.andWhere('it.authorId = :userId', { userId: params.userId });
						}),
					);
					subQuery.orWhere('it.isCustom = :notCustom', { notCustom: false });
				}),
			);
		}

		if (params.parentId) {
			query.andWhere(
				new Brackets(subQuery => {
					subQuery.where('it.parentId = :parentId', { parentId: params.parentId });
				}),
			);
		}

		if (params.searchString) {
			const toSearch = `%${params.searchString}%`;
			query.andWhere('it.name ILIKE :search', { search: toSearch });
		}

		return await query.getMany();
	}
}
