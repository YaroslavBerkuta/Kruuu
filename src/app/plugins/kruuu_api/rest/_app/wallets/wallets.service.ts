import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IncreaseBalanceDto, IncreaseCreaditDto } from './dto';
import {
	Currency,
	IWalletService,
	IWalletsActionsRepository,
	IWalletsRepository,
	WALLETS_ACTIONS_REPOSITORY,
	WALLETS_REPOSITORY,
	WALLETS_SERVICE,
} from '~api/domain/wallets/typing';
import { CheckoutType, IStripeService, STRIPE_SERVICE } from '~api/domain/stripe/typing';
import { PaymentMethod } from '~api/domain/payment/typing';
import { IPagination, WalletReason, getEnv, paginateAndGetMany } from '~api/shared';
import { transactions } from 'lisk-sdk';

@Injectable()
export class AppWalletsService {
	@Inject(WALLETS_REPOSITORY) private readonly walletRepository: IWalletsRepository;
	@Inject(WALLETS_SERVICE) private readonly walletService: IWalletService;
	@Inject(STRIPE_SERVICE) private readonly stripeService: IStripeService;
	@Inject(WALLETS_ACTIONS_REPOSITORY)
	private readonly wallletActionsRepository: IWalletsActionsRepository;

	public async walletsList(userId: number) {
		const wallets: any = await this.walletRepository.find({ where: { userId } });

		wallets.map((it, i, arr) => {
			if (it.currency === Currency.KruuuCoin) {
				arr[i].balance = transactions.convertBeddowsToLSK(String(it.balance));
			}
		});
		return wallets;
	}

	public async createDefaultWallets(userId: number) {
		await this.walletRepository.save({
			currency: Currency.IDR,
			balance: '0',
			name: 'IDR',
			userId,
		});
		await this.walletRepository.save({
			currency: Currency.Credit,
			balance: '0',
			name: 'Credit',
			userId,
		});

		return true;
	}

	public async increaseBalance(userId, dto: IncreaseBalanceDto) {
		switch (dto.paymentMethod) {
			case PaymentMethod.Stripe:
				return await this.stripeService.createInvoice({
					userId,
					currency: dto.currency,
					amount: dto.amount,
					checkoutType: CheckoutType.walletReplenishment,
				});
			case PaymentMethod.Duitcu:
				return false;

			default:
				return false;
		}
	}

	public async buyCredit(userId: number, dto: IncreaseCreaditDto) {
		const creaditWallet = await this.walletRepository.findOne({
			where: {
				currency: Currency.Credit,
				userId,
			},
		});

		const exitvalue = dto.amount / Number(getEnv('IDR_EXCHANGE_RATE'));

		const fromWallet = await this.walletRepository.findOneBy({
			currency: dto.fromCurrency,
			userId,
		});
		if (Number(fromWallet.balance) < dto.amount)
			throw new BadRequestException('Not enough funds on the balance sheet');

		await this.walletService.decreaseBalance({
			walletId: fromWallet.id,
			value: dto.amount,
			reason: WalletReason.Buying,
		});
		await this.walletService.increaseBalance({
			walletId: creaditWallet.id,
			value: exitvalue,
			reason: WalletReason.Buying,
		});
	}

	public async transactionList(userId: number, pagination: IPagination) {
		const query = this.wallletActionsRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.wallet', 'wallet')
			.leftJoinAndSelect('wallet.user', 'user')
			.where('user.id = :userId', { userId })
			.orderBy('it.createdAt', 'DESC');

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		return { items, count };
	}
}
