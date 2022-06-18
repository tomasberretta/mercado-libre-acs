import ProductService from "./ProductService";
import PriceRangeFilter from "../model/filter/PriceRangeFilter";
import CategoryFilter from "../model/filter/CategoryFilter";
import NameFilter from "../model/filter/NameFilter";
import {Context} from "../../resources/Context";

const productService = new ProductService();

const priceRangeFilter = new PriceRangeFilter();
const categoryFilter = new CategoryFilter();
const nameFilter = new NameFilter();


export default class SearchService {

    search = async(minPrice: number, maxPrice: number, word : string, category: string, context: Context):Promise<any>=>{
        let filteredProducts = (await productService.getProducts(context));

        if(minPrice!==null&&maxPrice!==null&&minPrice!==undefined&&maxPrice!==undefined){
            filteredProducts= priceRangeFilter.filter(filteredProducts,{minPrice:minPrice,maxPrice:maxPrice})
        }

        if(word!==null&&word!==""&&word!==undefined){
            filteredProducts= nameFilter.filter(filteredProducts,{word: word})
        }

        if(category!==null&&category!==""&&category!==undefined){
            filteredProducts= categoryFilter.filter(filteredProducts,{category: category})
        }

        return filteredProducts;
    }



}