import { Router} from 'express';
const productRouter = Router();
import ProductController from '../controller/ProductController';
const productController = new ProductController();

productRouter.get('/',async (req: any, res: any) => {
    await productController.getProducts(res);
});

export default productRouter;
