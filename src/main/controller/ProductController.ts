import ProductService from "../service/ProductService";
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const productService = new ProductService(prisma);


export default class ProductController {

    public async getProducts(res: any) {
        try {
            const products = await productService.getProducts();
            return res.status(200).json(products);
        } catch (e) {
            return res.status(400).json(e);
        }
    }

    public async getProductDetail(id:number, res: any) {
        try {
            const products = await productService.getProduct(id);
            return res.status(200).json(products);
        } catch (e) {
            return res.status(400).json(e);
        }
    }
}