import ProductService from "../../main/service/ProductService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import {Product, Provider, User, Category} from "@prisma/client";
import CartService from "../../main/service/CartService";
import { MockContext, Context, createMockContext } from '../../resources/Context';

/*
*
* - Cart should be empty when created
* - Cart should be able to add products
*
* */

const productService = new ProductService();
const userService = new UserService();
const providerService = new ProviderService();
const cartService = new CartService();

let product1:Product;
let product2:Product;
let product3:Product;

let user:User;
let user2:User;

let provider:Provider;

let mockContext: MockContext
let context: Context

beforeAll(async () => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context

    const providerDto = {
        id: 1,
        name: "ChairsAndTables",
        email: null,
        phone: null,
    }
    mockContext.prisma.provider.create.mockResolvedValue(providerDto)
    provider = await providerService.addProvider(providerDto.name, context);

    const productDto1 = {
        id: 1,
        name: "Chair",
        description: "Red chair",
        stock: 43,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 100,
        stockId: 1,
        invoiceId: null
    }
    const productDto2 = {
        id: 2,
        name: "Table",
        description: "Blue Table",
        stock: 17,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 120,
        stockId: 2,
        invoiceId: null
    }
    const productDto3 = {
        id: 3,
        name: "Table",
        description: "Green Table",
        stock: 0,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 120,
        stockId: 3,
        invoiceId: null
    }

    mockContext.prisma.product.create.mockResolvedValue(productDto1)
    product1 = await productService.addProduct(productDto1, context);
    mockContext.prisma.product.create.mockResolvedValue(productDto2)
    product2 = await productService.addProduct(productDto2, context);
    mockContext.prisma.product.create.mockResolvedValue(productDto3)
    product3 = await productService.addProduct(productDto3, context);

    const userDto1 = {
        id: 1,
        name: "Joe",
        email: null,
        phone: null
    }
    const userDto2 = {
        id: 2,
        name: "Mike",
        email: null,
        phone: null
    }

    mockContext.prisma.user.create.mockResolvedValue(userDto1);
    user = await userService.addUser(userDto1, context);
    mockContext.prisma.user.create.mockResolvedValue(userDto2);
    user2 = await userService.addUser(userDto2, context);
});

describe("Test Create Cart", () => {

    it("should return empty cart", async () => {
        const cartDto = {
            id: 1,
            userId: user.id,
            products: []
        }
        mockContext.prisma.cart.create.mockResolvedValue(cartDto);
        const cart = await cartService.createCart(user.id, context);
        expect(cart).toBeDefined()
        // @ts-ignore
        expect(cart.products.length).toBe(0);
    }
    );

});

describe("Test Add Product To Cart", () => {

    it("should return cart with product", async () => {
            const cartDto = {
                id: 1,
                userId: user2.id,
                products: []
            }
            mockContext.prisma.cart.create.mockResolvedValue(cartDto);
            const cart = await cartService.createCart(user2.id, context);
            expect(cart).toBeDefined()
            // @ts-ignore
            expect(cart.products.length).toBe(0);

            const updatedCartDto = {
                id: 1,
                userId: user2.id,
                products: [product1.id]
            }
            mockContext.prisma.cart.update.mockResolvedValue(updatedCartDto);
            await cartService.addProduct(product1.id,cart.id, context)
            mockContext.prisma.cart.findFirst.mockResolvedValue(updatedCartDto);
            const updatedCart = await cartService.getCart(cart.id, context)
            expect(updatedCart).toBeDefined()
            // @ts-ignore
            expect(updatedCart.products.length).toBe(1);
        }
    );

});

