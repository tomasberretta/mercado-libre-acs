import { Router } from 'express';
const cashierRouter = Router();
import CashierController from '../controller/CashierController';
import SuccessMerchantProcessor from "../api/SuccessMerchantProcessor";
const cashierController = new CashierController();

cashierRouter.get('/checkout/:cartId',async (req: any, res: any) => {
    const {cartId} = req.params
    const {payingMethod} = req.query
    if(cartId !== null && payingMethod !== null){
        const merchantProcessor = new SuccessMerchantProcessor()
        await cashierController.checkOut(cartId, merchantProcessor, payingMethod, res);
    } else {
        res.status(400).send({message: "Invalid request"})
    }

});

export default cashierRouter;
