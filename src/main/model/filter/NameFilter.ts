import Product from "../entity/Product";
import Filter from "./Filter";

export default class NameFilter implements Filter{

    filter(products: Product[], args: {word:string}): Product[] {
        return products.filter(product=> product.name.toLowerCase().includes(args.word.toLowerCase()))
    }

}