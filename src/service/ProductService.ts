import {Product} from '@prisma/client';

export default class ProductService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    getProducts = async (): Promise<Product[]> => {
        return await this.prisma.product.findMany({
            orderBy: {
                id: 'asc',
            }
        })
    }

}