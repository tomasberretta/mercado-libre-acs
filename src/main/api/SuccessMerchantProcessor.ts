import MerchantProcessor from "./MerchantProcessor";
import {PayingMethod} from '@prisma/client';

export default class SuccessMerchantProcessor implements MerchantProcessor{
    processPayment(payingMethod: PayingMethod, amount: number): boolean {
        return true;
    }
}