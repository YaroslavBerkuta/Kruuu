export interface IChatMessage {
	id: number;
	chatId: number;
	userId: number;
	content: string;
	isRead: boolean;
	createdAt: string;
}
