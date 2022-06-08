import {PayingMethod} from '@prisma/client';

export default interface MerchantProcessor{
    processPayment(payingMethod: PayingMethod, amount: number): boolean
}