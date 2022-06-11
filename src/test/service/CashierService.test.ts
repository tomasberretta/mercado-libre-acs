/*
*
* - Cashier receives not empty cart should calculate total
* - Cashier receives empty cart should return total 0
* - Cashier receives cart and valid paying method, and makes transaction
*
* */


import {PrismaClient, Product, Provider, User, Cart} from "@prisma/client";
import CashierService from "../../main/service/CashierService";
import ProductService from "../../main/service/ProductService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import CartService from "../../main/service/CartService";
import ReviewService from "../../main/service/ReviewService";
import SuccessMerchantProcessor from "../../main/api/SuccessMerchantProcessor";

const prisma = new PrismaClient();
const cashierService = new CashierService(prisma);
const productService = new ProductService(prisma);
const userService = new UserService(prisma);
const providerService = new ProviderService(prisma);
const cartService = new CartService(prisma);

let product1:Product;
let product2:Product;
let product3:Product;


let user:User;
let user2:User;
let user3:User;


let provider:Provider;
let emptyCart: Cart;
let cartWithProducts: Cart;
let cartToCheckout: Cart;




beforeAll(async () => {

    provider= await providerService.addProvider("ChairsAndTables");

    [product1, product2, product3] = await Promise.all([
        productService.addProduct("Chair", "Red chair", 43,provider.id,"SUPERMARKETS",100),
        productService.addProduct("Table", "Blue table",17,provider.id,"SUPERMARKETS",120),
        productService.addProduct("Table", "Green table",0,provider.id,"SUPERMARKETS",120)
    ]);
    user = await userService.addUser("Joe");
    user2 = await userService.addUser("Mike");
    user3 = await userService.addUser("Ana");

    emptyCart = await cartService.createCart(user.id);
    cartWithProducts = await cartService.createCart(user2.id);
    await cartService.addProduct(product1.id,cartWithProducts.id);
    await cartService.addProduct(product2.id,cartWithProducts.id);
    await cartService.addProduct(product3.id,cartWithProducts.id);

    cartToCheckout = await cartService.createCart(user3.id);
    await cartService.addProduct(product1.id,cartToCheckout.id);
    await cartService.addProduct(product2.id,cartToCheckout.id);

});


describe("Test Cashier Receives Empty Cart", () => {

    it("should return total 0", async () => {
        const total= await cashierService.getTotal(emptyCart.id);
        expect(total).toBeDefined();
        // @ts-ignore
        expect(total).toBe(0);
    });

});

describe("Test Cashier Receives Cart with 3 products", () => {

    it("should return total sum of prices", async () => {
        const total= await cashierService.getTotal(cartWithProducts.id);
        expect(total).toBeDefined();
        // @ts-ignore
        expect(total).toBe(340);
    });

});

describe("Test checkout cart", () => {

    it("should do all things ..." , async() =>{
        const invoice = await cashierService.pay(cartToCheckout.id, new SuccessMerchantProcessor(),"MERCADO_PAGO")
        expect(invoice).toBeDefined()
        expect(invoice.amount).toBe(220)

        // @ts-ignore
        expect(cartToCheckout.products.length).toBe(0)
        const updatedProduct = await productService.getProduct(product1.id)
        // @ts-ignore
        expect(updatedProduct.stock.stock).toBe(42)
    });
});