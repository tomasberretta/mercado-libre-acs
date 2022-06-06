import { Router} from 'express';
const productRouter = Router();
import ProductController from '../controller/ProductController';
const productController = new ProductController();

productRouter.get('/',async (req: any, res: any) => {
    await productController.getProducts(res);
});

productRouter.get('/detail/:id',async (req: any, res: any) => {
    const {id} = req.params;
    await productController.getProductDetail(id,res);
});

export default productRouter;
