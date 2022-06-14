import ProductEntity from "../entity/Product";
import {Category} from "../entity/Category";
import Filter from "./Filter";
import {Product} from "@prisma/client";

export default class CategoryFilter implements Filter{
    filterEntity(products: ProductEntity[] , args:{category: string}): ProductEntity[] {
        if(!Object.keys(Category).includes(args.category)) throw new Error("Not valid category");
        return products.filter((product: ProductEntity ) => product.category==args.category)
    }

    filter(products: Product[] , args:{category: string}): Product[] {
        if(!Object.keys(Category).includes(args.category)) throw new Error("Not valid category");
        return products.filter((product: Product ) => product.category==args.category)
    }
}