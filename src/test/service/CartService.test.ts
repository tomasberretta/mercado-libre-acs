import ProductService from "../../main/service/ProductService";
import ReviewService from "../../main/service/ReviewService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import {Product, Provider, Cart, User} from "@prisma/client";
import CartService from "../../main/service/CartService";
import CashierService from "../../main/service/CashierService";

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const productService = new ProductService(prisma);
const userService = new UserService(prisma);
const providerService = new ProviderService(prisma);
const cartService = new CartService(prisma);

let product1:Product;
let product2:Product;
let product3:Product;


let user:User;
let user2:User;

let provider:Provider;



    /*
    *
    * - Cart should be empty when created
    * - Cart should be able to add products
    *
    * */


beforeAll(async () => {

    provider= await providerService.addProvider("ChairsAndTables");

    [product1, product2, product3] = await Promise.all([
        productService.addProduct("Chair", "Red chair", 43,provider.id,"SUPERMARKETS",100),
        productService.addProduct("Table", "Blue table",17,provider.id,"SUPERMARKETS",120),
        productService.addProduct("Table", "Green table",0,provider.id,"SUPERMARKETS",120)
    ]);
    user = await userService.addUser("Joe");
    user2 = await userService.addUser("Mike");


});

describe("Test Create Cart", () => {

    it("should return empty cart", async () => {
        const cart = await cartService.createCart(user.id);
        expect(cart).toBeDefined()
        // @ts-ignore
        expect(cart.products.length).toBe(0);
    }
    );

});

describe("Test Add Product To Cart", () => {

    it("should return cart with product", async () => {
            const cart = await cartService.createCart(user2.id);
            expect(cart).toBeDefined()
            // @ts-ignore
            expect(cart.products.length).toBe(0);

            const updatedCart= await cartService.addProduct(product1.id,cart.id)
            expect(updatedCart).toBeDefined()
            // @ts-ignore
            expect(updatedCart.products.length).toBe(1);
        }
    );

});

