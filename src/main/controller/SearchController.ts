import SearchService from "../service/SearchService";
import {Context} from "../../resources/Context";
const searchService = new SearchService();


export default class SearchController {

    public async search(minPrice: number, maxPrice: number, word : string, category: string, res: any, context: Context) {
        try {
            const products = await searchService.search(minPrice, maxPrice, word , category, context);
            return res.status(200).json(products);
        } catch (e:any) {
            if(e.message !== null) return res.status(400).json({message: e.message});
            else return res.status(400).json(e);
        }
    }
}