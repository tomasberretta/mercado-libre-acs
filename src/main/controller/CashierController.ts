import CashierService from "../service/CashierService";
import MerchantProcessor from "../api/MerchantProcessor";
import {PayingMethod} from "@prisma/client";
import {Context} from '../../resources/Context';

const cashierService = new CashierService();

export default class CashierController {

    public async checkOut(cartId: number, merchantProcessor: MerchantProcessor, payingMethod: PayingMethod, res: any, context: Context) {
        try {
            const invoice = await cashierService.checkout(cartId,merchantProcessor,payingMethod, context);
            return res.status(200).json(invoice);
        } catch (e: any) {
            if(e.message !== null) return res.status(400).json({message: e.message});
            else return res.status(400).json(e);
        }
    }
}