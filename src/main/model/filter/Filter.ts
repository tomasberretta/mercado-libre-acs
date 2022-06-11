import Product from "../entity/Product";

export default interface Filter{
    filter(products: Product[], args:{}): Product[]
}