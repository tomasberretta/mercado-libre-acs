import {Cart, PrismaClient, Product, Review, PayingMethod, Invoice} from "@prisma/client";
import ProductService from "./ProductService";
import CartService from "./CartService";
import MerchantProcessor from "../api/MerchantProcessor";
import UserService from "./UserService";
import {log} from "util";

const prisma = new PrismaClient();
const productService = new ProductService(prisma);
const cartService = new CartService(prisma);
const userService = new UserService(prisma);


export default class CashierService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    getTotal = async (cartId: number): Promise<number> => {
        const products = await cartService.getProducts(cartId);
        //@ts-ignore
        const p = products.products
        let sum = 0;
        const l= p.length;
        if (l === 0) return sum;
        for (let i = 0; i < l; i++) {
            sum += await productService.getCurrentPrice(p[i].productId)
        }
        return sum;
    }

    getStock = async (cartId: number): Promise<boolean> => {
        const products = await cartService.getProducts(cartId);
        //@ts-ignore
        const p = products.products
        const l= p.length;

        if (l === 0) return false;
        for (let i = 0; i < l; i++) {

            if(!(await productService.hasStock(p[i].productId))){
                return false
            }
        }
        return true;
    }

    pay= async (cartId: number, merchantProcessor: MerchantProcessor, payingMethod:PayingMethod): Promise<any> => {

        //check product stock
        const hasStock = await this.getStock(cartId)
        if(hasStock){

            //get total
            const total = await this.getTotal(cartId)

            //successful transaction?
            const valid= merchantProcessor.processPayment(payingMethod,total);


            if(valid){
                //create invoice
                const invoice= await this.createInvoice(cartId,payingMethod,total)

                //remove from stock
                await this.removeProductsFromStock(cartId)
                //remove from cart
                await this.emptyCart(cartId)

                return invoice
            }else{
                throw new Error("Invalid paying method");
            }
        }else{
            throw new Error("No stock available for product");
        }

    }

    createInvoice= async (cartId: number, payingMethod: PayingMethod, amount: number): Promise<Invoice> => {
        const idProd = await cartService.getProductsId(cartId)
        return await this.prisma.invoice.create({
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



    removeProductsFromStock= async (cartId: number): Promise<any> =>{
        const products = await cartService.getProducts(cartId);
        //@ts-ignore
        const p = products.products;
        const l= p.length;
        for (let i = 0; i < l; i++) {
            //@ts-ignore
            await productService.removeFromStock(p[i].productId)
        }
    }

    emptyCart= async (cartId: number): Promise<any> =>{
        await cartService.emptyCart(cartId);
    }

}