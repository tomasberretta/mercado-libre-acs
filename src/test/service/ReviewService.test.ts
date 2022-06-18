import ReviewService from "../../main/service/ReviewService";
import {Category, PayingMethod, Product, Provider, User} from "@prisma/client";
import ProductService from "../../main/service/ProductService";
import UserService from "../../main/service/UserService";
import ProviderService from "../../main/service/ProviderService";
import { MockContext, Context, createMockContext } from '../../resources/Context';

const commentService = new ReviewService();
const productService = new ProductService();
const userService = new UserService();
const providerService = new ProviderService();

let product1:Product;
let product2:Product;
let provider:Provider;
let user: User;

let user2: User;

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

    mockContext.prisma.product.create.mockResolvedValue(productDto1)
    product1 = await productService.addProduct(productDto1, context);
    mockContext.prisma.product.create.mockResolvedValue(productDto2)
    product2 = await productService.addProduct(productDto2, context);

    const userDto1 = {
        id: 1,
        name: "Joe",
        email: null,
        phone: null
    }
    mockContext.prisma.user.create.mockResolvedValue(userDto1);
    user = await userService.addUser(userDto1, context);

    const userDto2 = {
        id: 2,
        name: "Pepe",
        email: null,
        phone: null
    }
    mockContext.prisma.user.create.mockResolvedValue(userDto2);
    user2 = await userService.addUser(userDto2, context);

});

describe("Test Add Comment to Product Description", () => {

    it("should return created comment", async () => {

        const productDto1 = {
            id: 1,
            name: "Chair",
            description: {
                id: 1,
                description: "Red chair",
                rating: 0,
                reviews: [],
                payingMethod: [PayingMethod.CREDIT_CARD, PayingMethod.DEBIT_CARD],
                productId: 1
            },
            stock: 43,
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
            stockId: 1,
            invoiceId: null
        }
        mockContext.prisma.product.findFirst.mockResolvedValue(productDto1);
        const productDesc = await productService.getProduct(product1.id, context);
        const reviewDto = {
            id: 1,
            comment:  "Very nice",
            rating: 5,
            productDescriptionId: productDesc.description.id,
            userId: user.id
        }
        mockContext.prisma.review.create.mockResolvedValue(reviewDto);
        mockContext.prisma.productDescription.findFirst.mockResolvedValue(productDesc.description);
        const updatedProductDescDto = {
            id: 1,
            description: "Red chair",
            rating: 5,
            reviews: [reviewDto],
            payingMethod: [PayingMethod.CREDIT_CARD, PayingMethod.DEBIT_CARD],
            productId: 1
        }
        mockContext.prisma.productDescription.update.mockResolvedValue(updatedProductDescDto);
        const comment = await commentService.addReview(reviewDto, context);
        expect(comment).toBeDefined();
        expect(comment.rating).toBe(reviewDto.rating);
        expect(comment.comment).toBe(reviewDto.comment);
        expect(comment.userId).toBe(reviewDto.userId);
    });

});
