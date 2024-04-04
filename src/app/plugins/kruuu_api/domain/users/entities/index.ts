import { UserCode } from './user-codes.entity';
import { UserSocial } from './user-social.entity';
import { UserUsedCode } from './user-used-codes.etity';
import { User } from './user.entity';

export const USERS_ENTITIES = [User, UserSocial, UserCode, UserUsedCode];

export { User, UserSocial, UserCode, UserUsedCode };
