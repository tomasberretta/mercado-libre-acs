import ProductEntity from "../entity/Product";
import Filter from "./Filter";
import {Product} from "@prisma/client";

export default class NameFilter implements Filter{

    filterEntity(products: ProductEntity[], args: {word:string}): ProductEntity[]  {
        return products.filter((product: ProductEntity)=> product.name.toLowerCase().includes(args.word.toLowerCase()))
    }

    filter(products: Product[], args: {word:string}): Product[] {
        return products.filter((product: Product)=> product.name.toLowerCase().includes(args.word.toLowerCase()))
    }

}