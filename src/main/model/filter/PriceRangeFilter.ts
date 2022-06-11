import Product from "../entity/Product";
import Filter from "./Filter";

export default class PriceRangeFilter implements Filter{

    filter(products: Product[], args:{minPrice: number, maxPrice: number}): Product[]{
        if(args.minPrice<0 || args.maxPrice <0) throw new Error("Prices should not be negative");
        if(args.minPrice>args.maxPrice) throw new Error("Max price should be greater than Min price");
        return products.filter(product => product.price<=args.maxPrice && product.price>=args.minPrice)
    }

}