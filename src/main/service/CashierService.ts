// @ts-ignore
import {Cart, PrismaClient, Product, Review, PayingMethod, Invoice} from "@prisma/client";
import ProductService from "./ProductService";
import CartService from "./CartService";
import MerchantProcessor from "../api/MerchantProcessor";
import UserService from "./UserService";

const prisma = new PrismaClient();
const productService = new ProductService(prisma);
const cartService = new CartService(prisma);
const userService = new UserService(prisma);


export default class CashierService {

    prisma: any;

    constructor(prisma: any) {
        this.prisma = prisma;
    }

    getTotal = async (cart: Cart): Promise<number> => {
        const products = await cartService.getProducts(cart.id);
        //@ts-ignore
        const p = products.products
        let sum = 0;
        const l= p.length;
        for (let i = 0; i < l; i++) {
            //@ts-ignore
            sum += await productService.getCurrentPrice(p[i].id)
        }
        return sum;
    }

    pay= async (cart:Cart, merchantProcessor: MerchantProcessor,payingMethod:PayingMethod): Promise<any> => {
        //get total
        const total = await this.getTotal(cart)

        //successful transaction?
        const valid= merchantProcessor.processPayment(payingMethod,total);

        if(valid){
            //create invoice
            const invoice= await this.createInvoice(cart,payingMethod,total)

            //remove from stock
            await this.removeProductsFromStock(cart)
            //remove from cart
            await this.emptyCart(cart)
        }else{
            return "error:)"
        }

    }

    createInvoice= async (cart: Cart, payingMethod: PayingMethod, amount: number): Promise<Invoice> => {
        const idProd = await cartService.getProductsId(cart.id)
        return await this.prisma.invoice.create({
            data:{
                cart:{
                    connect:{
                        id: Number(cart.id)
                    }
                },
                products:{
                    connectMany:{
                        idProd
                    }
                },
                amount: amount,
                payingMethod: payingMethod
            },
            include:{
                cart:true
            }
        })
    }

    removeProductsFromStock= async (cart: Cart): Promise<any> =>{
        const products = await cartService.getProducts(cart.id);
        //@ts-ignore
        const p = products.products;
        const l= p.length;
        for (let i = 0; i < l; i++) {
            //@ts-ignore
            await productService.removeFromStock(p[i].id)
        }
    }

    emptyCart= async (cart: Cart): Promise<any> =>{
        await cartService.emptyCart(cart.id);
    }

}