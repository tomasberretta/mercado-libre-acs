import {Product, Price, Category} from '@prisma/client';
import {Context} from "../../resources/Context";

export interface CreateProduct {
    name: string
    description: string
    stock: number
    providerId: number
    category: Category | string
    price: number
}

export default class ProductService {

    getProducts = async (context: Context): Promise<Product[]> => {
        return await context.prisma.product.findMany({
            orderBy: {
                id: 'asc',
            },
            include: {
                priceHistory: true,
                stock: true,
            }
        })
    }

    getProduct= async (productId: number, context: Context):Promise<any> =>{
        return await context.prisma.product.findFirst({
            where:{
                id: Number(productId)
            },
            include:{
                description:true,
                stock:true
            }
        })

    }

    addProduct = async(product: CreateProduct, context: Context):Promise<Product>=>{
        let category : Category;
        if (typeof product.category === "string") {
            const cat = Object.values(Category).find(c => c === product.category)
            category = cat ? cat : Category.SUPERMARKETS
        }else{
            category = product.category
        }
        return await context.prisma.product.create({
            data:{
                name: product.name,
                category: category,
                provider:{
                    connect:{
                        id: Number(product.providerId),
                    }
                },
                description:{
                    create:{
                        description: product.description,
                    }
                },
                stock:{
                   create:{
                       stock: Number(product.stock),
                   }
                },
                priceHistory:{
                    create:{
                        date: new Date(),
                        price: product.price
                    }
                }
            },
            include:{
                description:true,
                stock:true
            }
        })
    }

    getCurrentPrice= async (productId: number, context: Context):Promise<any> =>{
        const prices= await context.prisma.price.findMany({
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

    removeFromStock= async (productId: number, context: Context):Promise<any> =>{
        const productInfo= await this.getProduct(productId, context)

        await context.prisma.stock.update({
            where:{
                id: Number(productInfo.stockId),
            },
            data:{
              stock: Number(productInfo.stock.stock-1)
            }
        })
    }

    hasStock= async (productId: number, context: Context):Promise<boolean> =>{
        const productInfo= await this.getProduct(productId, context)
        return productInfo.stock.stock > 0
    }

    deleteProducts = async (context: Context)=>{
        await context.prisma.product.deleteMany({})
    }


}