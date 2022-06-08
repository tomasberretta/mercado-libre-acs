import MerchantProcessor from "./MerchantProcessor";
import {PayingMethod} from '@prisma/client';

export default class ErrorMerchantProcessor implements MerchantProcessor{
    processPayment(payingMethod: PayingMethod, amount: number): boolean {
        return false;
    }
}