import {PayingMethod, Invoice} from "@prisma/client";
import ProductService from "./ProductService";
import CartService from "./CartService";
import MerchantProcessor from "../api/MerchantProcessor";
import {Context} from "../../resources/Context";

const productService = new ProductService();
const cartService = new CartService();


export default class CashierService {

    getTotal = async (cartId: number, context: Context): Promise<number> => {
        const products = await cartService.getProducts(cartId, context);
        //@ts-ignore
        const p = products.products
        let sum = 0;
        const l= p.length;
        if (l === 0) return sum;
        for (let i = 0; i < l; i++) {
            sum += await productService.getCurrentPrice(p[i].productId, context)
        }
        return sum;
    }

    getStock = async (cartId: number, context: Context): Promise<boolean> => {
        const products = await cartService.getProducts(cartId, context);
        //@ts-ignore
        const p = products.products
        const l= p.length;

        if (l === 0) return false;
        for (let i = 0; i < l; i++) {

            if(!(await productService.hasStock(p[i].productId, context))){
                return false
            }
        }
        return true;
    }

    checkout = async (cartId: number, merchantProcessor: MerchantProcessor, payingMethod:PayingMethod, context: Context): Promise<any> => {
        const cart = await context.prisma.cart.findFirst({where:{id:Number(cartId)}})
        if (cart === null) throw new Error("Invalid cart Id");
        //check product stock
        const hasStock = await this.getStock(cartId, context)
        if(hasStock){

            //get total
            const total = await this.getTotal(cartId, context)

            // is valid paying method?
            const valid = Object.keys(PayingMethod).includes(payingMethod);
            if(valid){
                //was successful transaction?
                const successful = merchantProcessor.processPayment(payingMethod,total)
                if(successful){
                    //create invoice
                    const invoice= await this.createInvoice(cartId,payingMethod,total, context)

                    //remove from stock
                    await this.removeProductsFromStock(cartId, context)
                    //remove from cart
                    await this.emptyCart(cartId,context)

                    return invoice
                } else throw new Error("An error occurred processing payment");
            }else throw new Error("Invalid paying method");
        }else throw new Error("No stock available for product");

    }

    createInvoice= async (cartId: number, payingMethod: PayingMethod, amount: number, context: Context): Promise<Invoice> => {
        const idProd = await cartService.getProductsId(cartId, context)
        return await context.prisma.invoice.create({
            data:{
                cart:{
                    connect:{
                        id: Number(cartId)
                    }
                },
                products:{
                    //@ts-ignore
                    connect: idProd.products.map((ob) => {
                        return {
                           id: ob.productId
                        }
                    }),

                },
                amount: amount,
                payingMethod: payingMethod
            },
            include:{
                cart:true
            }
        })
    }



    removeProductsFromStock= async (cartId: number, context: Context): Promise<any> =>{
        const products = await cartService.getProducts(cartId, context);
        //@ts-ignore
        const p = products.products;
        const l= p.length;
        for (let i = 0; i < l; i++) {
            //@ts-ignore
            await productService.removeFromStock(p[i].productId, context)
        }
    }

    emptyCart= async (cartId: number, context: Context): Promise<any> =>{
        await cartService.emptyCart(cartId, context);
    }

}