import {Cart, Product} from '@prisma/client';

export default class CartService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    createCart = async(userId: number):Promise<Cart>=>{
        return await this.prisma.cart.create({
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

    addProduct = async(productId: number,cartId:number):Promise<Cart>=>{
        return await this.prisma.cart.update({
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


    getProducts = async(cartId: number) : Promise<Product[]> =>{
        return await this.prisma.cart.findFirst({
            where:{
                id:Number(cartId)
            },
            select:{
                products: true,
            }
        });
    }

    getProductsId = async(cartId: number) : Promise<number[]> =>{
        return await this.prisma.cart.findFirst({
            where:{
                id:Number(cartId)
            },
            select:{
                products: {
                    select:{
                        id: true
                    }
                },
            }
        });
    }

    getCart = async(cartId: number) : Promise<Cart> =>{
        return await this.prisma.cart.findFirst({
            where:{
                id:Number(cartId)
            },
        });
    }

    emptyCart = async(cartId: number) : Promise<Cart> =>{
        return await this.prisma.cart.update({
            where:{
                id:Number(cartId)
            },
            data:{
                products:[]
            }
        });
    }

    deleteCarts= async (): Promise<any> => {
        return await this.prisma.cart.deleteMany({})
    }

}