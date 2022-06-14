import {PrismaClient} from '@prisma/client';
import ProductService from "./ProductService";
import PriceRangeFilter from "../model/filter/PriceRangeFilter";
import CategoryFilter from "../model/filter/CategoryFilter";
import NameFilter from "../model/filter/NameFilter";
const prisma = new PrismaClient();
const productService = new ProductService(prisma);

const priceRangeFilter = new PriceRangeFilter();
const categoryFilter = new CategoryFilter();
const nameFilter = new NameFilter();


export default class SearchService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    search = async(minPrice: number, maxPrice: number, word : string, category: string):Promise<any>=>{
        // @ts-ignore
        let products = (await productService.getProducts()).products

        if(minPrice!==null&&maxPrice!==null){
            products= priceRangeFilter.filter(products,{minPrice:minPrice,maxPrice:maxPrice})
        }

        if(word!==null){
            products= nameFilter.filter(products,{word: word})
        }

        if(word!==null){
            products= categoryFilter.filter(products,{category: category})
        }

        return products;
    }



}