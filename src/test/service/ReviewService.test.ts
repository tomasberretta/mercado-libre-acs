import ReviewService from "../../main/service/ReviewService";
import {Product, Provider, User} from "@prisma/client";
import ProductService from "../../main/service/ProductService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import CartService from "../../main/service/CartService";
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const commentService = new ReviewService(prisma);
const productService = new ProductService(prisma);
const userService = new UserService(prisma);
const providerService = new ProviderService(prisma);

let product1:Product;
let product2:Product;
let provider:Provider;
let user: User;

beforeAll(async () => {



    provider= await providerService.addProvider("ChairsAndTables");

    [product1, product2] = await Promise.all([productService.addProduct("Chair", "Red chair",3,provider.id, "VEHICLES", 2), productService.addProduct("Table", "Blue table",18,provider.id, "VEHICLES", 3)]);
    user = await userService.addUser("ElPepe");

    // @ts-ignore
    await commentService.addReview("Very nice", 5, product2.description.id, user.id);
    // @ts-ignore
    await commentService.addReview("Different from picture", 4, product2.description.id, user.id);
    // @ts-ignore
    await commentService.addReview("Missing leg", 1, product2.description.id, user.id);
});

describe("Test Add Comment to Product Description", () => {

    it("should return created comment", async () => {
        const commentString = "Very nice"
        const ratingNumber = 5;
        // @ts-ignore
        const productDescriptionId = product1.description.id;
        const userId= user.id;
        const comment = await commentService.addReview(commentString, ratingNumber, productDescriptionId, userId);
        expect(comment).toBeDefined();
        expect(comment.rating).toBe(ratingNumber);
        expect(comment.comment).toBe(commentString);
        expect(comment.userId).toBe(userId);
    });

});
