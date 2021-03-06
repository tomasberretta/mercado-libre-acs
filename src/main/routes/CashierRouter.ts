import { Router } from 'express';
const cashierRouter = Router();
import CashierController from '../controller/CashierController';
import SuccessMerchantProcessor from "../api/SuccessMerchantProcessor";
import {getContext} from "../../resources/Context";
const cashierController = new CashierController();
const context = getContext()


cashierRouter.get('/checkout/:cartId',async (req: any, res: any) => {
    const {cartId} = req.params
    const {payingMethod} = req.query
    if(cartId !== null && payingMethod !== null){
        const merchantProcessor = new SuccessMerchantProcessor()
        await cashierController.checkOut(cartId, merchantProcessor, payingMethod, res, context);
    } else {
        res.status(400).send({message: "Invalid request"})
    }

});

export default cashierRouter;
