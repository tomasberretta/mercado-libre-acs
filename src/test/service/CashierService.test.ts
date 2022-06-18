import {Product, Provider, User, Cart, Category, PayingMethod} from "@prisma/client";
import CashierService from "../../main/service/CashierService";
import ProductService from "../../main/service/ProductService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import CartService from "../../main/service/CartService";
import SuccessMerchantProcessor from "../../main/api/SuccessMerchantProcessor";
import { MockContext, Context, createMockContext } from '../../resources/Context';

/*
*
* - Cashier receives not empty cart should calculate total
* - Cashier receives empty cart should return total 0
* - Cashier receives cart and valid paying method, and makes transaction
*
* */

let mockContext: MockContext
let context: Context

const cashierService = new CashierService();
const productService = new ProductService();
const userService = new UserService();
const providerService = new ProviderService();
const cartService = new CartService();

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
    const userDto3 = {
        id: 3,
        name: "Ana",
        email: null,
        phone: null
    }

    mockContext.prisma.user.create.mockResolvedValue(userDto1);
    user = await userService.addUser(userDto1, context);
    mockContext.prisma.user.create.mockResolvedValue(userDto2);
    user2 = await userService.addUser(userDto2, context);
    mockContext.prisma.user.create.mockResolvedValue(userDto3);
    user3 = await userService.addUser(userDto3, context);

    const cartDto = {
        id: 1,
        userId: user.id,
        products: []
    }
    mockContext.prisma.cart.create.mockResolvedValue(cartDto);
    emptyCart = await cartService.createCart(user.id, context);

    const cartDto2 = {
        id: 2,
        userId: user2.id,
        products: [product1.id, product2.id, product3.id]
    }
    mockContext.prisma.cart.create.mockResolvedValue(cartDto2);
    cartWithProducts = await cartService.createCart(user2.id, context);

    const cartDto3 = {
        id: 3,
        userId: user3.id,
        products: [product1.id, product2.id]
    }
    mockContext.prisma.cart.create.mockResolvedValue(cartDto3);
    cartToCheckout = await cartService.createCart(user3.id, context);

});



describe("Test Cashier Receives Empty Cart", () => {

    it("should return total 0", async () => {
        mockContext.prisma.cart.findFirst.mockResolvedValue(emptyCart);
        mockContext.prisma.price.findMany.mockResolvedValue([]);
        const total= await cashierService.getTotal(emptyCart.id, context);
        expect(total).toBeDefined();
        // @ts-ignore
        expect(total).toBe(0);
    });

});

describe("Test Cashier Receives Cart with 3 products", () => {

    it("should return total sum of prices", async () => {
        const priceDto1 = {
            id: 1,
            price: 100,
            date: new Date(),
            productId: 1
        }
        const priceDto2 = {
            id: 2,
            price: 120,
            date: new Date(),
            productId: 2
        }
        const priceDto3 = {
            id: 3,
            price: 120,
            date: new Date(),
            productId: 3
        }

        const cartDto2 = {
            id: 2,
            userId: user2.id,
            products: [{id: 1, productId: product1.id}, {id: 2, productId: product2.id}, {id: 3, productId: product3.id}]
        }
        mockContext.prisma.cart.findFirst.mockResolvedValue(cartDto2);
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto1]);
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto2]);
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto3]);
        const total = await cashierService.getTotal(cartWithProducts.id, context);
        expect(total).toBeDefined();
        expect(total).toBe(340);
    });

});

describe("Test checkout cart", () => {

    it("should do all things ..." , async() =>{
        const cartDto3 = {
            id: 3,
            userId: user3.id,
            products: [{id: 1, productId: product1.id}, {id: 2, productId: product2.id}]
        }
        mockContext.prisma.cart.findFirst.mockResolvedValue(cartDto3);

        const productDto1 = {
            id: 1,
            name: "Chair",
            description: "Red chair",
            stock: {id: 1, stock: 43},
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
            stock: {id: 1, stock: 17},
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 120,
            stockId: 2,
            invoiceId: null
        }
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productDto1);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productDto2);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productDto1);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productDto2);

        const priceDto1 = {
            id: 1,
            price: 100,
            date: new Date(),
            productId: 1
        }
        const priceDto2 = {
            id: 2,
            price: 120,
            date: new Date(),
            productId: 2
        }
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto1]);
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto2]);

        const invoiceDto = {
            id:1,
            cartId:3,
            amount:220,
            payingMethod: PayingMethod.MERCADO_PAGO,
            products: [product1.id, product2.id]
        }
        mockContext.prisma.invoice.create.mockResolvedValue(invoiceDto);

        const updatedCartDto = {
            id: 3,
            userId: user3.id,
            products: []
        }
        mockContext.prisma.cart.update.mockResolvedValue(updatedCartDto)

        const updatedStockDto = {
            id: 1,
            stock: 42,
            productId: 1
        }
        mockContext.prisma.stock.update.mockResolvedValue(updatedStockDto)
        const invoice = await cashierService.checkout(cartToCheckout.id, new SuccessMerchantProcessor(),PayingMethod.MERCADO_PAGO, context);
        expect(invoice).toBeDefined()
        expect(invoice.amount).toBe(220)

        const updatedCartDto2 = {
            id: 3,
            userId: user3.id,
            products: []
        }
        mockContext.prisma.cart.findFirst.mockResolvedValue(updatedCartDto2);
        const updatedCartToCheckout = await cartService.getCart(cartToCheckout.id, context);
        // @ts-ignore
        expect(updatedCartToCheckout.products.length).toBe(0)
        const updatedProductDto1 = {
            id: 1,
            name: "Chair",
            description: "Red chair",
            stock: {id: 1, stock: 42},
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
            stockId: 1,
            invoiceId: null
        }
        mockContext.prisma.product.findFirst.mockResolvedValue(updatedProductDto1);
        const updatedProduct = await productService.getProduct(product1.id, context);
        // @ts-ignore
        expect(updatedProduct.stock.stock).toBe(42)
    });
});