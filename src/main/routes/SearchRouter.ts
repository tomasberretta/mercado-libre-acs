import { Router} from 'express';
const searchRouter = Router();
import SearchController from '../controller/SearchController';
const searchController = new SearchController();

searchRouter.get('/filter',async (req: any, res: any) => {
    const {minPrice, maxPrice, word, category} = req.query
    await searchController.search(minPrice, maxPrice, word , category, res);
});

export default searchRouter;