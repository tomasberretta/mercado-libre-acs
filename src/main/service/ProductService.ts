import {Product, Price} from '@prisma/client';

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

    getCurrentPrice= async (productId: number):Promise<any> =>{
        const prices= await this.prisma.price.findMany({
            where:{
                productId: Number(productId)
            }
        });

        if (prices.length === 0) throw new Error("Product does not have prices");

        prices.sort((a:Price, b:Price) => {
            return b.date.getTime() - a.date.getTime();
        });

        return prices[0].price;

    }

    removeFromStock= async (productId: number):Promise<any> =>{
        const productInfo= await this.getProduct(productId)

        await this.prisma.stock.update({
            where:{
                id: Number(productInfo.stockId),
            },
            data:{
              stock: Number(productInfo.stock.stock-1)
            }
        })
    }

    hasStock= async (productId: number):Promise<boolean> =>{
        const productInfo= await this.getProduct(productId)
        return productInfo.stock.stock > 0
    }

    deleteProducts = async ()=>{
        await this.prisma.product.deleteMany({})
    }


}