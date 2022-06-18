import { MockContext, Context, createMockContext } from '../../resources/Context';
import ResponseMock from "../resources/ResponseMock";
import ProductController from "../../main/controller/ProductController";
import {Category} from "@prisma/client";
import ProductService from "../../main/service/ProductService";
import ProviderService from "../../main/service/ProviderService";

const productController = new ProductController()

const productService = new ProductService();
const providerService = new ProviderService();

let mockContext: MockContext
let context: Context

beforeAll(async () => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context
})

describe("Test Get Products empty", () => {

    it("should return a response with 200 status", async () => {
        const res = new ResponseMock()
        mockContext.prisma.product.findMany.mockResolvedValue([])
        const response = await productController.getProducts(res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual([]);
    });

});

describe("Test Get Products with Products", () => {

    it("should return a response with 200 status", async () => {
        const providerDto = {
            id: 1,
            name: "ChairsAndTables",
            email: null,
            phone: null,
        }
        mockContext.prisma.provider.create.mockResolvedValue(providerDto)
        const provider = await providerService.addProvider(providerDto.name, context);

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
        const product1 = await productService.addProduct(productDto1, context);
        mockContext.prisma.product.create.mockResolvedValue(productDto2)
        const product2 = await productService.addProduct(productDto2, context);
        mockContext.prisma.product.create.mockResolvedValue(productDto3)
        const product3 = await productService.addProduct(productDto3, context);

        const res = new ResponseMock()
        mockContext.prisma.product.findMany.mockResolvedValue([product1, product2, product3])

        const response = await productController.getProducts(res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual([product1, product2, product3]);
    });

});

describe("Test Get Product by ID with invalid ID", () => {

    it("should return a response with 404 status", async () => {

        const res = new ResponseMock()
        mockContext.prisma.product.findFirst.mockResolvedValue(null)

        const response = await productController.getProductDetail(9999, res, context);
        expect(JSON.parse(response).status).toBe(404);
        expect(JSON.parse(response).data).toStrictEqual({message: "Product not found"});
    });

});

describe("Test Get Product by ID with valid ID", () => {

    it("should return a response with 200 status", async () => {
        const providerDto = {
            id: 1,
            name: "ChairsAndTables",
            email: null,
            phone: null,
        }
        mockContext.prisma.provider.create.mockResolvedValue(providerDto)
        const provider = await providerService.addProvider(providerDto.name, context);

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

        mockContext.prisma.product.create.mockResolvedValue(productDto1)
        const product1 = await productService.addProduct(productDto1, context);

        const res = new ResponseMock()
        mockContext.prisma.product.findFirst.mockResolvedValue(productDto1)

        const response = await productController.getProductDetail(product1.id, res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual(product1);
    });

});