import { Router} from 'express';
const productRouter = Router();
import ProductController from '../controller/ProductController';
import {getContext} from "../../resources/Context";
const productController = new ProductController();
const context = getContext()


productRouter.get('/',async (req: any, res: any) => {
    await productController.getProducts(res, context);
});

productRouter.get('/detail/:id',async (req: any, res: any) => {
    const {id} = req.params;
    await productController.getProductDetail(id, res, context);
});

export default productRouter;
