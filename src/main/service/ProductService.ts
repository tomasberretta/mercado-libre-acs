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

    getProduct= async (productId: number):Promise<any> =>{
        return await this.prisma.product.findFirst({
            where:{
                id: Number(productId)
            },
            include:{
                description:true,
                stock:true
            }
        })

    }

    addProduct = async(name:String, description:String, stock: number, providerId: number, category: String, price:number):Promise<Product>=>{
        return await this.prisma.product.create({
            data:{
                name: name,
                category:category,
                provider:{
                    connect:{
                        id: Number(providerId),
                    }
                },
                description:{
                    create:{
                        description: description,
                    }
                },
                stock:{
                   create:{
                       stock: Number(stock),
                   }
                },
                priceHistory:{
                    create:{
                        date: new Date(),
                        price: price
                    }
                }
            },
            include:{
                description:true,
                stock:true
            }
        })
    }

}