// @ts-ignore
import products from "./products.json";
// @ts-ignore
import providers from "./providers.json";
// @ts-ignore
import users from "./users.json";
import {getContext} from "../../resources/Context";
import ProductService from "../../main/service/ProductService";
import ProviderService from "../../main/service/ProviderService";
import UserService from "../../main/service/UserService";
import CartService from "../../main/service/CartService";

const context = getContext()
const productService = new ProductService();
const providerService = new ProviderService();
const userService = new UserService();
const cartService = new CartService();

async function f() {
    for (let providersKey in providers) {
        const providerDto = providers[providersKey];
        await providerService.addProvider(providerDto.name, context);
    }

    for (let productsKey in products) {
        const productDto = products[productsKey];
        await productService.addProduct(productDto, context);
    }

    for (let usersKey in users) {
        const userDto = users[usersKey];
        await userService.addUser(userDto, context);
    }

    for (let usersKey in users) {
        const userDto = users[usersKey];
        await cartService.createCart(userDto.id, context);
    }

    for (let usersKey in users) {
        const userDto = users[usersKey];
        const cart = await cartService.getCart(userDto.id, context);
        const randomNumber = Math.floor(Math.random() * 20);
        let count = 0;
        for (let productsKey in products) {
            if (count >= randomNumber) break;
            const productDto = products[productsKey];
            // @ts-ignore
            await cartService.addProduct(productDto.id, cart.id, context);
            count++;
        }
    }
}

f().then(r => console.log("Done!"));