import {getContext} from "../../resources/Context";
import ProviderService from "../../main/service/ProviderService";
import ProductService, {CreateProduct} from "../../main/service/ProductService";
import {Category, Provider} from "@prisma/client";

const request = require('supertest');
const app = require("../../main/app")
const context = getContext()


const providerService = new ProviderService();
const productService = new ProductService();

let provider:Provider;

let products: CreateProduct[];

beforeAll(async () => {
    await providerService.deleteProviders(context);
    await productService.deleteProducts(context);

    provider = await providerService.addProvider("ChairsAndTables", context);
    const productDto1 = {
        id: 1,
        name: "Cake",
        description: "Chocolate",
        stock: 43,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 100,
        stockId: 1,
        invoiceId: null
    }

    const productDto2 = {
        id: 2,
        name: "Big cake",
        description: "Vanilla",
        stock: 10,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 150,
        stockId: 2,
        invoiceId: null
    }

    const productDto3 = {
        id: 3,
        name: "Cookies",
        description: "with chips",
        stock: 10,
        providerId: provider.id,
        category: Category.SUPERMARKETS,
        price: 75,
        stockId: 3,
        invoiceId: null
    }

    const productDto4 = {
        id: 4,
        name: "Car",
        description: "Red",
        stock: 3,
        providerId: provider.id,
        category: Category.VEHICLES,
        price: 1000000000,
        stockId: 4,
        invoiceId: null
    }

    const productDto5 = {
        id: 5,
        name: "Gummy bears",
        description: "Candy",
        stock: 100,
        providerId: provider.id,
        category: Category.VEHICLES,
        price: 10,
        stockId: 5,
        invoiceId: null
    }

    const productDto6 = {
        id: 6,
        name: "iPhone 12",
        description: "Silver",
        stock: 100,
        providerId: provider.id,
        category: Category.PHONES,
        price: 4000,
        stockId: 6,
        invoiceId: null
    }

    const productDto7 = {
        id: 7,
        name: "iPhone 11",
        description: "Gold",
        stock: 100,
        providerId: provider.id,
        category: Category.PHONES,
        price: 2000,
        stockId: 7,
        invoiceId: null
    }

    const productDto8 = {
        id: 8,
        name: "iPhone 508",
        description: "Silver",
        stock: 100,
        providerId: provider.id,
        category: Category.PHONES,
        price: 1500,
        stockId: 8,
        invoiceId: null
    }

    const productDto9 = {
        id: 9,
        name: "iPhone 508 Adapter",
        description: "Silver",
        stock: 100,
        providerId: provider.id,
        category: Category.TECHNOLOGY,
        price: 200,
        stockId: 9,
        invoiceId: null
    }

    const productDto10 = {
        id: 10,
        name: "Car 1886 Model",
        description: "Old",
        stock: 100,
        providerId: provider.id,
        category: Category.VEHICLES,
        price: 200,
        stockId: 10,
        invoiceId: null
    }

    const productDto11 = {
        id: 11,
        name: "Android J1",
        description: "Black",
        stock: 100,
        providerId: provider.id,
        category: Category.PHONES,
        price: 10,
        stockId: 10,
        invoiceId: null
    }

    products = [productDto1, productDto2, productDto3, productDto4, productDto5, productDto6, productDto7, productDto8, productDto9, productDto10, productDto11]
    for (let product of products) {
        await productService.addProduct(product, context);
    }
});

describe('GET /search/filter', function() {
    it('responds with all products array and 200', async function() {
        const response = await request(app).get('/search/filter').send()
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(products.length);
    });

    it('searches by valid price and returns status 200', async function() {
        const response = await request(app).get('/search/filter?minPrice=60&maxPrice=200').send()
        expect(response.status).toEqual(200);
        expect(response.body.length).toBe(5);
    });

    it('searches by invalid price range and returns status 400', async function() {
        const response = await request(app).get('/search/filter?minPrice=600&maxPrice=200').send()
        expect(response.status).toEqual(400);
    });

    it('searches by negative price and returns status 400', async function() {
        const response = await request(app).get('/search/filter?minPrice=-600&maxPrice=200').send()
        expect(response.status).toEqual(400);
    });

    it('searches by valid category and returns status 200', async function() {
        const response = await request(app).get('/search/filter?category=VEHICLES').send()
        expect(response.status).toEqual(200);
        expect(response.body.length).toBe(3);
    });

    it('searches by invalid category and returns status 400', async function() {
        const response = await request(app).get('/search/filter?category=WOOD').send()
        expect(response.status).toEqual(400);
    });

    it('searches by valid name and returns status 200', async function() {
        const response = await request(app).get('/search/filter?word=cake').send()
        expect(response.status).toEqual(200);
        expect(response.body.length).toBe(2);
    });

    it('searches by valid name, price range, category and returns status 200', async function() {
        const response = await request(app).get('/search/filter?minPrice=10&maxPrice=2500&word=phone&category=PHONES').send()
        expect(response.status).toEqual(200);
        expect(response.body.length).toBe(2);
    });

    it('searches by invalid name, price range, category and returns status 400', async function() {
        const response = await request(app).get('/search/filter?minPrice=-10&maxPrice=2500&word=phone&category=WOOD').send()
        expect(response.status).toEqual(400);
    });
});