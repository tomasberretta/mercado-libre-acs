import Product from "../entity/Product";
import {Category} from "../entity/Category";
import Filter from "./Filter";

export default class CategoryFilter implements Filter{
    filter(products: Product[], args:{category: string}): Product[]{
        if(Object.keys(Category).includes(args.category)) throw new Error("Not valid category");
        return products.filter(product => product.category==args.category)
    }
}