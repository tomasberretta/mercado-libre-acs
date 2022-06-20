// @ts-ignore
import products from "./products.json";
// @ts-ignore
import providers from "./providers.json";
// @ts-ignore
import users from "./users.json";
import {getContext} from "../src/resources/Context";
import ProductService from "../src/main/service/ProductService";
import ProviderService from "../src/main/service/ProviderService";
import UserService from "../src/main/service/UserService";
import CartService from "../src/main/service/CartService";

const context = getContext()
const productService = new ProductService();
const providerService = new ProviderService();
const userService = new UserService();
const cartService = new CartService();

async function f() {
    console.log("Setting up data");
    for (let providersKey in providers) {
        const providerDto = providers[providersKey];
        await providerService.addProvider(providerDto.name, context);
    }
    console.log("Providers set up");

    for (let productsKey in products) {
        const productDto = products[productsKey];
        await productService.addProduct(productDto, context);
    }
    console.log("Products set up");

    for (let usersKey in users) {
        const userDto = users[usersKey];
        await userService.addUser(userDto, context);
    }
    console.log("Users set up");

    for (let usersKey in users) {
        const userDto = users[usersKey];
        await cartService.createCart(userDto.id, context);
    }
    console.log("Carts set up");

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
    console.log("Carts with products set up");
}

f().then(r => console.log("Done!"));