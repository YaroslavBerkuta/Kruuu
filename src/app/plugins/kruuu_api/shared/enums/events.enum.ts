import { Socket } from 'socket.io';
import { IChatMember } from '~api/domain/chats/typing';
import { SessionType } from '~api/domain/sessions/typing';
import { Currency } from '~api/domain/wallets/typing';

export enum Events {
	OnErrorJoinUser = 'OnErrorJoinUser',
	StopSessions = 'StopSessions',
	OnUserConnect = 'OnUserConnect',
	OnUserDisconnect = 'OnUserDisconnect',
	OnUserDeleted = 'OnUserDeleted',
	OnChatMessageView = 'OnChatMessageView',
	OnReadChat = 'OnReadChat',
	AcceptApplication = 'AcceptApplication',
	RejectApplication = 'RejectApplication',
	LikeTalent = 'LikeTalent',
	OnNewMessage = 'OnNewMessage',
	NewApplication = 'NewApplication',
	ViewTalent = 'ViewTalent',
	IncreaseWalletBalance = 'IncreaseWalletBalance',
	ChangeProject = 'changeProject',
	CloseProject = 'closeProject',
}

export interface IEventsPayloads {
	[Events.IncreaseWalletBalance]: {
		userId: number;
		value: number;
		currency: Currency;
	};

	[Events.StopSessions]: {
		userId: number;
		sessionsIds?: number[];
	};

	[Events.OnErrorJoinUser]: {
		socket: Socket;
	};

	[Events.OnUserConnect]: {
		userId: number;
		sessionType?: SessionType;
	};

	[Events.OnUserDisconnect]: {
		userId: number;
		deviceUUId?: string;
		sessionType?: SessionType;
	};

	[Events.OnUserDeleted]: {
		userId: number;
	};

	[Events.OnChatMessageView]: {
		userId: number;
		messageIds: number[];
	};

	[Events.OnReadChat]: {
		userId: number;
		chatId: number;
	};

	[Events.OnNewMessage]: {
		authorId: number;
		targetUser: IChatMember[];
		chatId: number;
	};

	[Events.NewApplication]: {
		talentId: number;
		employerId: number;
		jobId: number;
	};

	[Events.RejectApplication]: {
		talentId: number;
		employerId: number;
		jobId: number;
	};
	[Events.LikeTalent]: {
		talentId: number;
		employerId: number;
		like: boolean;
	};

	[Events.ViewTalent]: {
		employerId: number;
		talentId: number;
	};

	[Events.CloseProject]: {
		projectId: number;
	};
}
