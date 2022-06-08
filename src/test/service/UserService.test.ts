import {PrismaClient, User} from "@prisma/client";
import UserService from "../../main/service/UserService";
import CashierService from "../../main/service/CashierService";
import ProductService from "../../main/service/ProductService";
import ProviderService from "../../main/service/ProviderService";
import CartService from "../../main/service/CartService";
import ReviewService from "../../main/service/ReviewService";

const prisma = new PrismaClient();
const userService = new UserService(prisma);
const productService = new ProductService(prisma);
const reviewService = new ReviewService(prisma);
const providerService = new ProviderService(prisma);
const cartService = new CartService(prisma);


beforeAll(async () => {

    await userService.deleteUsers();
    await productService.deleteProducts();
    await reviewService.deleteReviews();
    await providerService.deleteProviders();
    await cartService.deleteCarts();

});

describe("Test Add User", () => {

    it("should return user", async () => {
        const name = "Pepe"
        const user : User = await userService.addUser(name);
        expect(user).toBeDefined();
        // @ts-ignore
        expect(user.name).toBe(name);
    });

});