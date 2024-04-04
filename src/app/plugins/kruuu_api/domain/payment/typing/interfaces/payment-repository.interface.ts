import { Repository } from 'typeorm';
import { IPayment } from './payment.interface';

export type IPaymentRepository = Repository<IPayment>;
