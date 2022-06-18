import ProviderService from "../../main/service/ProviderService";
import ProductService from "../../main/service/ProductService";
import {getContext} from "../../resources/Context";
import {Cart, Category, PayingMethod, Product, Provider, User} from "@prisma/client";
import CartService from "../../main/service/CartService";
import UserService from "../../main/service/UserService";

const request = require('supertest');
const app = require("../../main/app")

const productService = new ProductService();
const cartService = new CartService();
const userService = new UserService();
const providerService = new ProviderService();
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

describe('GET /cashier/checkout/:cartId', function() {
    it('with valid id responds with product detail and 200', async function() {
        const payingMethod = PayingMethod.DEBIT_CARD;

        const response = await request(app).get(`/cashier/checkout/${cart.id}?payingMethod=${payingMethod}`).send()

        const invoiceDto = {
            id: response.body.id,
            cartId: cart.id,
            amount: 220,
            payingMethod: payingMethod,
            cart: { id: cart.id, userId: user.id }
        }

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(invoiceDto);
    });

    it('with invalid payment method responds with error message and 400', async function() {
        const payingMethod = 'GOLD';

        const response = await request(app).get(`/cashier/checkout/${cart.id}?payingMethod=${payingMethod}`).send()

        expect(response.status).toEqual(400);
        expect(response.body.message).toStrictEqual("Invalid paying method");
    });

    it('with invalid cart id responds with error message and 400', async function() {
        const payingMethod = PayingMethod.DEBIT_CARD;

        await cartService.deleteCarts(context)

        const response = await request(app).get(`/cashier/checkout/${cart.id}?payingMethod=${payingMethod}`).send()

        expect(response.status).toEqual(400);
        expect(response.body.message).toStrictEqual("Invalid cart Id");
    });

    it('with empty cart responds with error message and 400', async function() {
        const payingMethod = PayingMethod.DEBIT_CARD;

        const userDto2 = {
            name: "Pepe",
            email: null,
            phone: null
        }

        const user2 = await userService.addUser(userDto2, context);

        const cart2 = await cartService.createCart(user2.id, context);

        const response = await request(app).get(`/cashier/checkout/${cart2.id}?payingMethod=${payingMethod}`).send()

        expect(response.status).toEqual(400);
        expect(response.body.message).toStrictEqual("No stock available for product");
    });

});
