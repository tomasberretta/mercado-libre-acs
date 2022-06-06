/*
*
* - Product with no Reviews/ reviews should have rating 0 *
* - Products with more than one Review rating should be average of Reviews rating *
* - If product is in stock should return current stock *
* - If product is not in stock should return 0 *
* - When asking for product details should return all information including:
*            description
*            name
*            category
*            price
*            information from provider
*            rating
*            stock
*            paying methods
* */

import ProductService from "../../main/service/ProductService";
import {Product,Provider} from "@prisma/client";
import ReviewService from "../../main/service/ReviewService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const productService = new ProductService(prisma);
const reviewService = new ReviewService(prisma);
const userService = new UserService(prisma);
const providerService = new ProviderService(prisma)


let product1:Product;
let product2:Product;
let product3:Product;


let provider:Provider;

beforeAll(async () => {
    provider= await providerService.addProvider("ChairsAndTables");

    [product1, product2, product3] = await Promise.all([
        productService.addProduct("Chair", "Red chair", 43,provider.id,"SUPERMARKETS",100),
        productService.addProduct("Table", "Blue table",17,provider.id,"SUPERMARKETS",120),
        productService.addProduct("Table", "Green table",0,provider.id,"SUPERMARKETS",120)
    ]);

    const user = await userService.addUser("Joe");

    // @ts-ignore
    await reviewService.addReview("Very nice", 5, product2.description.id, user.id);
    // @ts-ignore
    await reviewService.addReview("Different from picture", 3, product2.description.id, user.id);
    // @ts-ignore
    await reviewService.addReview("Missing leg", 1, product2.description.id, user.id);
});

describe("Test Add Product With No Description", () => {

    it("should return product with no description", async () => {
        const product : Product = await productService.addProduct("Chair", "Black chair",10,provider.id, "SUPERMARKETS",100);
        expect(product).toBeDefined();
        // @ts-ignore
        expect(product.description).toBeDefined();
    });

});

describe("Test Get Product Description With No Reviews", () => {

    it("should return product description with rating 0", async () => {
        // @ts-ignore
        const product = await productService.getProduct(product1.id);
        expect(product).toBeDefined();
        // @ts-ignore
        expect(product.description.rating).toBe(product1.description.rating);
    });

});

describe("Test Get Product Description With One Or More Reviews", () => {

    it("should return product description with rating Review rating average", async () => {
        // @ts-ignore
        const rating = await reviewService.getRating(product2.description.id);
        // @ts-ignore
        const product = await productService.getProduct(product2.id);
        expect(product).toBeDefined();
        // @ts-ignore
        expect(product.description.rating).toBe(rating.rating);
    });

});

describe("Test Get Product Description With No Stock", () =>{

    it("should return stock 0", async () => {
        // @ts-ignore
        const product = await productService.getProduct(product3.id);
        expect(product).toBeDefined()
        // @ts-ignore
        expect(product.stock.stock).toBe(0);
    });

});

describe("Test Get Product Description With Stock", () =>{

    it("should return stock value", async () => {
        // @ts-ignore
        const product = await productService.getProduct(product2.id);
        expect(product).toBeDefined()
        // @ts-ignore
        expect(product.stock.stock).toBe(17);
    });

});

describe("Test Get Product Description", () =>{

    it("should return product description with: description, name,category,price,information from provider,rating,stock,paying methods", async () => {
        // @ts-ignore
        const product = await productService.getProduct(product2.id);
        expect(product).toBeDefined()
        expect(product.name).toBe(product2.name);
        // @ts-ignore
        expect(product.category).toBe(product2.category);
        // @ts-ignore
        expect(product.priceHistory).toBe(product2.priceHistory);
        // @ts-ignore
        expect(product.provider).toBe(product2.provider);
        // @ts-ignore
        expect(product.description.description).toBe(product2.description.description);
        // @ts-ignore
        expect(product.description.rating).toBe(3);
        // @ts-ignore
        expect(product.stock.stock).toBe(product2.stock.stock);
        // @ts-ignore
        expect(product.description.paymentMethods).toBe(product2.description.paymentMethods);


        // @ts-ignore
        expect(product.stock.stock).toBe(17);
    });

});
