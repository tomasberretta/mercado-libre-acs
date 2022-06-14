import SearchService from "../service/SearchService";
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const searchService = new SearchService(prisma);


export default class SearchController {

    public async search(minPrice: number, maxPrice: number, word : string, category: string, res: any) {
        try {
            const products = await searchService.search(minPrice, maxPrice, word , category );
            return res.status(200).json(products);
        } catch (e) {
            return res.status(400).json(e);
        }
    }
}