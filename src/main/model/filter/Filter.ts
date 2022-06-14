import ProductEntity from "../entity/Product";
import {Product} from "@prisma/client";

export default interface Filter{
    filterEntity(products: ProductEntity[] , args:{}): ProductEntity[];
    filter(products: Product[], args:{}): Product[];
}