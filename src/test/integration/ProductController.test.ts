import ProductController from "../../main/controller/ProductController";
import ResponseMock from "../resources/ResponseMock";
import {getContext} from "../../resources/Context";
import {Category} from "@prisma/client";
import ProductService from "../../main/service/ProductService";
import ProviderService from "../../main/service/ProviderService";
const providerService = new ProviderService();

const productController = new ProductController()
const productService = new ProductService();
const context = getContext()

beforeAll(async () => {
    await productService.deleteProducts(context);
    await providerService.deleteProviders(context);
});

afterAll(async () => {
    await productService.deleteProducts(context);
    await providerService.deleteProviders(context);
});

describe("Test Get Products empty", () => {

    it("should return a response with 200 status", async () => {
        const res = new ResponseMock()
        const response = await productController.getProducts(res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual([]);
    });

});

describe("Test Get Products with Products", () => {

    it("should return a response with 200 status", async () => {


        const provider = await providerService.addProvider("ChairsAndTables", context);

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
        const createProductDto3 = {
            name: "Table",
            description: "Green Table",
            stock: 0,
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 120,
        }

        const product1 = await productService.addProduct(createProductDto1, context);
        const product2 = await productService.addProduct(createProductDto2, context);
        const product3 = await productService.addProduct(createProductDto3, context);

        const productDto1 = {
            id: product1.id,
            name: 'Chair',
            stockId: product1.stockId,
            providerId: provider.id,
            category: 'SUPERMARKETS',
            invoiceId: null
        }
        const productDto2 = {
            id: product2.id,
            name: 'Table',
            stockId: product2.stockId,
            providerId: provider.id,
            category: 'SUPERMARKETS',
            invoiceId: null
        }
        const productDto3 = {
            id: product3.id,
            name: 'Table',
            stockId: product3.stockId,
            providerId: provider.id,
            category: 'SUPERMARKETS',
            invoiceId: null
        }

        const res = new ResponseMock()
        const response = await productController.getProducts(res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data.length).toBe(3);
        expect(JSON.parse(response).data[0].name).toStrictEqual(productDto1.name);
        expect(JSON.parse(response).data[1].name).toStrictEqual(productDto2.name);
        expect(JSON.parse(response).data[2].name).toStrictEqual(productDto3.name);
    });

});

describe("Test Get Product by ID with invalid ID", () => {

    it("should return a response with 404 status", async () => {

        await productService.deleteProducts(context);

        const provider = await providerService.addProvider("ChairsAndTables", context);

        const createProductDto1 = {
            name: "Chair",
            description: "Red chair",
            stock: 43,
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
        }
        await productService.addProduct(createProductDto1, context);
        const res = new ResponseMock()
        const response = await productController.getProductDetail(999999, res, context);
        expect(JSON.parse(response).status).toBe(404);
        expect(JSON.parse(response).data).toStrictEqual({message: "Product not found"});
    });

});

describe("Test Get Product by ID with valid ID", () => {

    it("should return a response with 200 status", async () => {

        await productService.deleteProducts(context);

        const provider = await providerService.addProvider("ChairsAndTables", context);

        const createProductDto1 = {
            name: "Chair",
            description: "Red chair",
            stock: 43,
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
        }

        const product1 = await productService.addProduct(createProductDto1, context);

        const res = new ResponseMock()
        const response = await productController.getProductDetail(product1.id, res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual(product1);
    });

});

