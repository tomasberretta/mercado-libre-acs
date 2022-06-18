import ProviderService from "../../main/service/ProviderService";
import ProductService from "../../main/service/ProductService";
import {getContext} from "../../resources/Context";
import {Category} from "@prisma/client";

const request = require('supertest');
const app = require("../../main/app")
const context = getContext()


const providerService = new ProviderService();
const productService = new ProductService();

beforeAll(async () => {
    await productService.deleteProducts(context);
    await providerService.deleteProviders(context);
});

describe('GET /products', function() {
    it('responds with empty array and 200', async function() {
        const response = await request(app).get('/product').send()
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
    });

    it('responds with product array and 200', async function() {
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

        const response = await request(app).get('/product').send()
        expect(response.status).toEqual(200);
        expect(response.body.length).toBe(3);
        expect(response.body[0].name).toStrictEqual(productDto1.name);
        expect(response.body[1].name).toStrictEqual(productDto2.name);
        expect(response.body[2].name).toStrictEqual(productDto3.name);
    });
});

describe('GET /product/detail/:id', function() {
    it('with valid id responds with product detail and 200', async function() {
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

        const productDto1 = {
            id: product1.id,
            name: 'Chair',
            stockId: product1.stockId,
            providerId: provider.id,
            category: 'SUPERMARKETS',
            invoiceId: null,
            description: {
                // @ts-ignore
                id: product1.description.id,
                description: 'Red chair',
                rating: 0,
                payingMethod: [],
                productId: product1.id
            },
            stock: { id: product1.stockId, stock: 43 }

        }
        const response = await request(app).get(`/product/detail/${product1.id}`).send()
        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual(productDto1);
    });

    it('with invalid id responds with error message and 404', async function() {
        const provider = await providerService.addProvider("ChairsAndTables", context);
        await productService.deleteProducts(context);

        const createProductDto1 = {
            name: "Chair",
            description: "Red chair",
            stock: 43,
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
        }
        await productService.addProduct(createProductDto1, context);
        const response = await request(app).get(`/product/detail/${999999}`).send()
        expect(response.status).toEqual(404);
        expect(response.body).toStrictEqual({message: "Product not found"});
    });
});
