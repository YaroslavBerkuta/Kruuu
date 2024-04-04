export type TCodeReceiverCallback = (code: string) => Promise<void> | void;

export interface IConfirmationCodesService {
	sendConfirmationCode(receiver: string, senderCallback: TCodeReceiverCallback): Promise<string>;

	confirmCode(receiver: string, code: string, ip?: string): Promise<boolean>;

	compareCode(receiver: string, code: string): Promise<boolean>;
}
