/*
 *
 * https://documentation.onesignal.com/v6.0/reference#create-notification
 *
 */

/*  {"en": "English Subtitle", "es": "Spanish Subtitle"} */

interface ILangValueContent {
	en?: any;

	uk?: any;
}

interface IActionButton {
	id: string;

	text: string;

	icon?: string;
}

export interface INewNotification {
	/* Global params */

	contents: ILangValueContent;

	headings: ILangValueContent;

	subtitle?: ILangValueContent;

	content_available?: boolean;

	/* Attachments */
	data?: {
		[key: string]: any;
	};

	/* Action Buttons */
	buttons?: IActionButton[];

	ios_badgeCount?: number;
	ios_badgeType?: 'None' | 'SetTo' | 'Increase';
	/* Appearance */

	// TODO
}

// Interface for send notification to some users
export interface INewNotificationToUsers extends INewNotification {
	include_player_ids: string[];
}

export interface IPushNotificationsUser {
	id: string;
	identifier: unknown;
	session_count: number;
	language: string;
	timezone: number;
	game_version: string;
	device_os: string;
	device_type: number;
	device_model: string;
	ad_id: string;
	last_active: string;
	playtime: number;
	amount_spent: number;
	created_at: number;
	invalid_identifier: boolean;
	badge_count: number;
	ip: string;
}
