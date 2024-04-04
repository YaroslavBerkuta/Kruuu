import { Repository } from 'typeorm';
import { ITalentEducation } from './talent-education.interface';
import { ITalentSkill } from './talent-skill.interface';
import { ITalentInfo } from './talent.interface';
import { ITalentLike } from './talent-likes.interface';

export type ITalentsInfoRepository = Repository<ITalentInfo>;
export type ITalentsSkillsRepository = Repository<ITalentSkill>;
export type ITalentEducationRepository = Repository<ITalentEducation>;

export type ITalentLikeRepository = Repository<ITalentLike>;
