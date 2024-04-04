import { Repository } from 'typeorm';
import { IWallet, IWalletAction } from './wallet.interface';

export type IWalletsRepository = Repository<IWallet>;
export type IWalletsActionsRepository = Repository<IWalletAction>;
