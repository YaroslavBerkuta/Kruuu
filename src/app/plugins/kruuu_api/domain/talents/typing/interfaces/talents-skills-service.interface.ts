import { ITalentSkill } from './talent-skill.interface';

export interface ITalentsSkillsService {
	save(userId: number, skillTagIds: number[]): Promise<ITalentSkill[]>;
}
