import CashierService from "../service/CashierService";
import MerchantProcessor from "../api/MerchantProcessor";
import {PayingMethod} from "@prisma/client";
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const cashierService = new CashierService(prisma);


export default class CashierController {

    public async checkOut(cartId: number, merchantProcessor: MerchantProcessor, payingMethod: PayingMethod, res: any) {
        try {
            const clinics = await cashierService.pay(cartId,merchantProcessor,payingMethod);
            return res.status(200).json(clinics);
        } catch (e) {
            return res.status(400).json(e);
        }
    }
}