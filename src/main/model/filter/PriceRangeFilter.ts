import ProductEntity from "../entity/Product";
import Filter from "./Filter";
import {Product} from "@prisma/client";

export default class PriceRangeFilter implements Filter{

    filterEntity(products: ProductEntity[], args:{minPrice: number, maxPrice: number}): ProductEntity[] {
        if(args.minPrice<0 || args.maxPrice <0) throw new Error("Prices should not be negative");
        if(args.minPrice>args.maxPrice) throw new Error("Max price should be greater than Min price");
        return products.filter((product: ProductEntity) => {
            const price = product.priceHistory[product.priceHistory.length-1].price;
            return price <= args.maxPrice && price >= args.minPrice
        })
    }

    filter(products: Product[] , args:{minPrice: number, maxPrice: number}): Product[]{
        if(Number(args.minPrice)<0 || Number(args.maxPrice) <0) throw new Error("Prices should not be negative");
        if(Number(args.minPrice)>Number(args.maxPrice)) throw new Error("Max price should be greater than Min price");
        return products.filter((product: Product) => {
            // @ts-ignore
            const price = product.priceHistory[product.priceHistory.length-1].price;
            return price <= Number(args.maxPrice) && price >= Number(args.minPrice)
        })
    }

}