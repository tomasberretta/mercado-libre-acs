import ProductService from "../../main/service/ProductService";
import {Category, PayingMethod, Product, Provider, User} from "@prisma/client";
import ReviewService from "../../main/service/ReviewService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import { MockContext, Context, createMockContext } from '../../resources/Context';

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

const productService = new ProductService();
const reviewService = new ReviewService();
const userService = new UserService();
const providerService = new ProviderService();

let product1:Product;
let product2:Product;

let user1:User;
let user2:User;
let user3:User;

let provider:Provider;

let mockContext: MockContext
let context: Context

const providerDto = {
    id: 1,
    name: "ChairsAndTables",
    email: null,
    phone: null,
}

const productDtoToFind1 = {
    id: 3,
    name: "Table",
    description: {
        id: 1,
        description: "Green table",
        rating: 0,
        reviews: [],
        payingMethod: [ PayingMethod.DEBIT_CARD],
        productId: 1
    },
    stock: {id: 3, stock: 0},
    providerId: providerDto.id,
    category: Category.SUPERMARKETS,
    price: 120,
    stockId: 3,
    invoiceId: null
}

const createProductDto1 = {
    id: 1,
    name: "Table",
    description: "Blue Table",
    stock: 17,
    providerId: providerDto.id,
    category: Category.SUPERMARKETS,
    price: 120,
    stockId: 1,
    invoiceId: null
}

const createProductDto2 = {
    id: 2,
    name: "Table",
    description: "Green Table",
    stock: 0,
    providerId: providerDto.id,
    category: Category.SUPERMARKETS,
    price: 120,
    stockId: 2,
    invoiceId: null
}

const createUserDto1 = {
    id: 1,
    name: "Joe",
    email: null,
    phone: null
}
const createUserDto2 = {
    id: 2,
    name: "Mike",
    email: null,
    phone: null
}
const createUserDto3 = {
    id: 3,
    name: "Ana",
    email: null,
    phone: null
}

const reviewDto1 = {
    comment: "Very nice",
    rating: 5,
    productDescription: 1,
    user: createUserDto1.id
}
const reviewDto2 = {
    comment: "Different from picture",
    rating: 4,
    productDescription: 1,
    user: createUserDto2.id
}
const reviewDto3 = {
    comment: "Missing leg",
    rating: 1,
    productDescription: 1,
    user: createUserDto3.id
}

const productDescription1 = {
    id: 1,
    description: "Blue table",
    rating: 5,
    reviews: [reviewDto1, reviewDto2, reviewDto3],
    payingMethod: [PayingMethod.CREDIT_CARD, PayingMethod.DEBIT_CARD],
    productId: 1
}

const priceHistory = [{id: 1, price: 120, date: new Date()}];

const productWithDescriptionAndStockAndPriceHistoryDto = {
    id: 1,
    name: "Table",
    description: productDescription1,
    providerId: providerDto.id,
    category: Category.SUPERMARKETS,
    priceHistory: priceHistory,
    stockId: 1,
    invoiceId: null,
    stock: {id: 1, stock: 17},
}

const productWithNoReviewsDto = {
    id: 1,
    name: "Table",
    description: {
        id: 1,
        description: "Blue table",
        rating: 0,
        reviews: [],
        payingMethod: [PayingMethod.CREDIT_CARD, PayingMethod.DEBIT_CARD],
        productId: 1
    },
    stock: {id: 1, stock: 43},
    providerId: providerDto.id,
    category: Category.SUPERMARKETS,
    priceHistory: priceHistory,
    stockId: 1,
    invoiceId: null
}

beforeAll(async () => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context

    mockContext.prisma.provider.create.mockResolvedValue(providerDto)
    provider = await providerService.addProvider(providerDto.name, context);

    mockContext.prisma.product.create.mockResolvedValue(createProductDto1)
    mockContext.prisma.product.create.mockResolvedValue(createProductDto1)
    product1 = await productService.addProduct(createProductDto1, context);
    mockContext.prisma.product.create.mockResolvedValue(createProductDto2)
    product2 = await productService.addProduct(createProductDto2, context);

    mockContext.prisma.user.create.mockResolvedValue(createUserDto1);
    user1 = await userService.addUser(createUserDto1, context);
    mockContext.prisma.user.create.mockResolvedValue(createUserDto2);
    user2 = await userService.addUser(createUserDto2, context);
    mockContext.prisma.user.create.mockResolvedValue(createUserDto3);
    user3 = await userService.addUser(createUserDto3, context);

    mockContext.prisma.product.findFirst.mockResolvedValueOnce(productWithDescriptionAndStockAndPriceHistoryDto)
    product1 = await productService.getProduct(createProductDto1.id, context);
});

describe("Test Add Product With No Description", () => {

    it("should return product with no description", async () => {
        const newCreateProductDto = {
            id: 3,
            name: "Chair",
            description: "Black Chair",
            stock: 10,
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
            stockId: 3,
            invoiceId: null
        }
        mockContext.prisma.product.create.mockResolvedValueOnce(newCreateProductDto)
        const product = await productService.addProduct(newCreateProductDto, context);
        expect(product).toBeDefined();
        // @ts-ignore
        expect(product.description).toBeDefined();
    });

});

describe("Test Get Product Description With No Reviews", () => {

    it("should return product description with rating 0", async () => {

        mockContext.prisma.product.findFirst.mockResolvedValue(productWithNoReviewsDto)
        const product = await productService.getProduct(productWithNoReviewsDto.id, context);
        expect(product).toBeDefined();
        // @ts-ignore
        expect(product.description.rating).toBe(0);
    });

});

describe("Test Get Product Description With One Or More Reviews", () => {

    it("should return product description with rating Review rating average", async () => {
        mockContext.prisma.productDescription.findFirst.mockResolvedValue(productDescription1)
        // @ts-ignore
        const rating = await reviewService.getRating(product1.description.id, context);
        mockContext.prisma.product.findFirst.mockResolvedValue(product1)
        const product = await productService.getProduct(product1.id, context);
        expect(product).toBeDefined();
        // @ts-ignore
        expect(product.description.rating).toBe(rating.rating);
    });

});

describe("Test Get Product Description With No Stock", () =>{

    it("should return stock 0", async () => {
        mockContext.prisma.product.findFirst.mockResolvedValue(productDtoToFind1)
        const product = await productService.getProduct(product2.id, context);
        expect(product).toBeDefined()
        expect(product.stock.stock).toBe(0);
    });

});

describe("Test Get Product Description With Stock", () =>{

    it("should return stock value", async () => {
        mockContext.prisma.product.findFirst.mockResolvedValue(productWithDescriptionAndStockAndPriceHistoryDto)
        const product = await productService.getProduct(productWithDescriptionAndStockAndPriceHistoryDto.id, context);
        expect(product).toBeDefined()
        expect(product.stock.stock).toBe(17);
    });

});

describe("Test Get Product Description", () =>{

    it("should return product description with: description, name,category,price,information from provider,rating,stock", async () => {
        const stock = {id: 2, stock: 17};
        mockContext.prisma.product.findFirst.mockResolvedValue(productWithDescriptionAndStockAndPriceHistoryDto)
        const product = await productService.getProduct(product1.id, context);
        expect(product).toBeDefined()
        expect(product.name).toBe(product1.name);
        expect(product.category).toBe(product1.category);
        expect(product.priceHistory).toBe(priceHistory);
        expect(product.providerId).toBe(product1.providerId);
        expect(product.description.description).toBe(productDescription1.description);
        expect(product.description.rating).toBe(productDescription1.rating);
        expect(product.stock.stock).toBe(stock.stock);
    });

});
