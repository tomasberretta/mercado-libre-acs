import ResponseMock from "../resources/ResponseMock";
import {getContext} from "../../resources/Context";
import {Cart, Category, PayingMethod, Product, Provider, User} from "@prisma/client";
import ProductService from "../../main/service/ProductService";
import ProviderService from "../../main/service/ProviderService";
import CashierController from "../../main/controller/CashierController";
import SuccessMerchantProcessor from "../../main/api/SuccessMerchantProcessor";
import CartService from "../../main/service/CartService";
import UserService from "../../main/service/UserService";
import ErrorMerchantProcessor from "../../main/api/ErrorMerchantProcessor";

const cashierController = new CashierController()
const productService = new ProductService();
const providerService = new ProviderService();
const cartService = new CartService();
const userService = new UserService();
const context = getContext()

let product1:Product;
let product2:Product;

let cart:Cart;

let user:User;
let provider:Provider;

beforeAll(async () => {
    await productService.deleteProducts(context);
    await providerService.deleteProviders(context);
    await userService.deleteUsers(context);

    provider = await providerService.addProvider("ChairsAndTables", context);

    const createProductDto1 = {
        name: "Chair",
        description: "Red chair",
        stock: 43,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 100,
    }
    const createProductDto2 = {
        name: "Table",
        description: "Blue Table",
        stock: 17,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 120,
    }

    product1 = await productService.addProduct(createProductDto1, context);
    product2 = await productService.addProduct(createProductDto2, context);

    const userDto1 = {
        name: "Joe",
        email: null,
        phone: null
    }

    user = await userService.addUser(userDto1, context);

    cart = await cartService.createCart(user.id, context);


    await cartService.addProduct(product1.id,cart.id, context)
    await cartService.addProduct(product2.id,cart.id, context)

});

afterAll(async () => {
    await productService.deleteProducts(context);
    await providerService.deleteProviders(context);
    await userService.deleteUsers(context);
});

describe("Test checkout with Success Merchant Processor", () => {

    it("should return a response with 200 status", async () => {
        const res = new ResponseMock()
        const merchantProcessor = new SuccessMerchantProcessor();
        const payingMethod = PayingMethod.DEBIT_CARD;
        const response = await cashierController.checkOut(cart.id, merchantProcessor, payingMethod, res, context);

        const invoiceDto = {
            id: JSON.parse(response).data.id,
            cartId: cart.id,
            amount: 220,
            payingMethod: payingMethod,
            cart: { id: cart.id, userId: user.id }
        }
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual(invoiceDto);
    });

});

describe("Test checkout with Error Merchant Processor", () => {

    it("should return a response with 400 status", async () => {
        const res = new ResponseMock()
        const merchantProcessor = new ErrorMerchantProcessor();
        const payingMethod = PayingMethod.DEBIT_CARD;
        const response = await cashierController.checkOut(cart.id, merchantProcessor, payingMethod, res, context);

        const invoiceDto = {
            id: JSON.parse(response).data.id,
            cartId: cart.id,
            amount: 220,
            payingMethod: payingMethod,
            cart: { id: cart.id, userId: user.id }
        }
        expect(JSON.parse(response).status).toBe(400);
        expect(JSON.parse(response).data).toStrictEqual({message: "An error occurred processing payment"});
    });

});

