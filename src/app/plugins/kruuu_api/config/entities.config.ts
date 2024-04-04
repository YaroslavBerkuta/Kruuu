import { APPLICATION_ENTITIES } from '~api/domain/applications/entities';
import { CHATS_ENTITIES } from '~api/domain/chats/entities';
import { EMPLOYER_ENTITIES } from '~api/domain/employer/enitites';
import { GALLERIES_ENTITIES } from '~api/domain/galleries/entities';
import { INSTITUTIONS_ENTITIES } from '~api/domain/institutoins/entities';
import { JOBS_ENTITIES } from '~api/domain/jobs/entities';
import { NOTIFICATION_ENTITIES } from '~api/domain/notifications/entities';
import { PAYMENT_ENTITIES } from '~api/domain/payment/entities';
import { PROJECT_ENTITIES } from '~api/domain/projects/entities';
import { SESSIONS_ENTITIES } from '~api/domain/sessions/entities';
import { SOCIAL_ENTITIES } from '~api/domain/social/entities';
import { TAGS_ENTITIES } from '~api/domain/tags/entities';
import { TALENTS_ENTITIES } from '~api/domain/talents/entities';
import { USERS_ENTITIES } from '~api/domain/users/entities';
import { WALLETS_ENTITES } from '~api/domain/wallets/entities';
import { CERIIFICATION_ENTITY } from '~api/domain/certificates/entities';

export const ENTITIES = [
	...USERS_ENTITIES,
	...SESSIONS_ENTITIES,
	...TAGS_ENTITIES,
	...GALLERIES_ENTITIES,
	...SOCIAL_ENTITIES,
	...TALENTS_ENTITIES,
	...PROJECT_ENTITIES,
	...EMPLOYER_ENTITIES,
	...JOBS_ENTITIES,
	...CHATS_ENTITIES,
	...APPLICATION_ENTITIES,
	...PAYMENT_ENTITIES,
	...NOTIFICATION_ENTITIES,
	...WALLETS_ENTITES,
	...INSTITUTIONS_ENTITIES,
	...CERIIFICATION_ENTITY,
];
