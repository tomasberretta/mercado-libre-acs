import {Cart} from '@prisma/client';
import {Context} from "../../resources/Context";

export default class CartService {

    createCart = async(userId: number, context: Context):Promise<Cart>=>{
        return await context.prisma.cart.create({
            data: {
                user: {
                    connect:{
                        id: Number(userId)
                    }
                }
            },
            include: {
                products: true
            }
        });
    }

    addProduct = async(productId: number, cartId:number, context: Context):Promise<void>=>{
        await context.prisma.cart.update({
            where:{
                id:Number(cartId)
            },
            data:{
                products:{
                    create:{
                        productId: Number(productId)
                    }
                }
            },
            include:{
                products: true
            }
        });
    }

    getProducts = async(cartId: number, context: Context) : Promise<any> =>{
        return await context.prisma.cart.findFirst({
            where:{
                id:Number(cartId)
            },
            select:{
                products: true,
            }
        });
    }

    getProductsId = async(cartId: number, context: Context) : Promise<any> =>{
        return await context.prisma.cart.findFirst({
            where:{
                id:Number(cartId)
            },
            select:{
                products: {
                    select:{
                        productId: true
                    }
                },
            }
        });
    }

    getCart = async(cartId: number, context: Context) : Promise<Cart|null> =>{
        return await context.prisma.cart.findFirst({
            where:{
                id:Number(cartId)
            },
            include: {
                products: true
            }
        });
    }

    emptyCart = async(cartId: number, context: Context) : Promise<Cart> =>{
        return await context.prisma.cart.update({
            where:{
                id:Number(cartId)
            },
            data:{
                products: {
                    create:[]
                }
            }
        });
    }

    deleteCarts= async (context: Context): Promise<any> => {
        return await context.prisma.cart.deleteMany({})
    }

}