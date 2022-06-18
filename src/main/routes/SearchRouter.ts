import { Router} from 'express';
const searchRouter = Router();
import SearchController from '../controller/SearchController';
import {getContext} from "../../resources/Context";
const searchController = new SearchController();
const context = getContext()

searchRouter.get('/filter',async (req: any, res: any) => {
    const {minPrice, maxPrice, word, category} = req.query
    await searchController.search(minPrice, maxPrice, word , category, res, context);
});

export default searchRouter;