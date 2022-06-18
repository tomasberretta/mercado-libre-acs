import ProductService from "../service/ProductService";
import {Context} from "../../resources/Context";

const productService = new ProductService();

export default class ProductController {

    public async getProducts(res: any, context: Context) {
        try {
            const products = await productService.getProducts(context);
            return res.status(200).json(products);
        } catch (e) {
            return res.status(400).json(e);
        }
    }

    public async getProductDetail(id:number, res: any, context: Context) {
        try {
            const product = await productService.getProduct(id, context);
            if (product === null) return res.status(404).json({message: "Product not found"});
            else return res.status(200).json(product);
        } catch (e) {
            return res.status(400).json(e);
        }
    }
}