import {Context, createMockContext, MockContext} from "../../resources/Context";
import ResponseMock from "../resources/ResponseMock";
import {Category} from "@prisma/client";
import SearchController from "../../main/controller/SearchController";

const searchController = new SearchController();

let mockContext: MockContext
let context: Context

const productDto1 = {
    id: 1,
    name: "Cake",
    description: "Chocolate",
    stock: 43,
    providerId: 1,
    category: Category.SUPERMARKETS,
    priceHistory: [{price: 100, date: new Date()}],
    stockId: 1,
    invoiceId: null
}

const productDto2 = {
    id: 2,
    name: "Big cake",
    description: "Vanilla",
    stock: 10,
    providerId: 1,
    category: Category.SUPERMARKETS,
    priceHistory: [{price: 150, date: new Date()}],
    stockId: 2,
    invoiceId: null
}

const productDto3 = {
    id: 3,
    name: "Cookies",
    description: "with chips",
    stock: 10,
    providerId: 1,
    category: Category.SUPERMARKETS,
    priceHistory: [{price: 75, date: new Date()}],
    stockId: 3,
    invoiceId: null
}

const productDto4 = {
    id: 4,
    name: "Car",
    description: "Red",
    stock: 3,
    providerId: 1,
    category: Category.VEHICLES,
    priceHistory: [{price: 1000000000, date: new Date()}],
    stockId: 4,
    invoiceId: null
}

const productDto5 = {
    id: 5,
    name: "Gummy bears",
    description: "Candy",
    stock: 100,
    providerId: 1,
    category: Category.VEHICLES,
    priceHistory: [{price: 10, date: new Date()}],
    stockId: 5,
    invoiceId: null
}

const productDto6 = {
    id: 6,
    name: "iPhone 12",
    description: "Silver",
    stock: 100,
    providerId: 1,
    category: Category.PHONES,
    priceHistory: [{price: 4000, date: new Date()}],
    stockId: 6,
    invoiceId: null
}

const productDto7 = {
    id: 7,
    name: "iPhone 11",
    description: "Gold",
    stock: 100,
    providerId: 1,
    category: Category.PHONES,
    priceHistory: [{price: 2000, date: new Date()}],
    stockId: 7,
    invoiceId: null
}

const productDto8 = {
    id: 8,
    name: "iPhone 508",
    description: "Silver",
    stock: 100,
    providerId: 1,
    category: Category.PHONES,
    priceHistory: [{price: 1500, date: new Date()}],
    stockId: 8,
    invoiceId: null
}

const productDto9 = {
    id: 9,
    name: "iPhone 508 Adapter",
    description: "Silver",
    stock: 100,
    providerId: 1,
    category: Category.TECHNOLOGY,
    priceHistory: [{price: 200, date: new Date()}],
    stockId: 9,
    invoiceId: null
}

const productDto10 = {
    id: 10,
    name: "Car 1886 Model",
    description: "Old",
    stock: 100,
    providerId: 1,
    category: Category.VEHICLES,
    priceHistory: [{price: 200, date: new Date()}],
    stockId: 10,
    invoiceId: null
}

const productDto11 = {
    id: 11,
    name: "Android J1",
    description: "Black",
    stock: 100,
    providerId: 1,
    category: Category.PHONES,
    priceHistory: [{price: 10, date: new Date()}],
    stockId: 10,
    invoiceId: null
}

const products = [productDto1, productDto2, productDto3, productDto4, productDto5, productDto6, productDto7, productDto8, productDto9, productDto10, productDto11]


beforeAll(async () => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context
    mockContext.prisma.product.findMany.mockResolvedValue(products)
})

describe("Test Price Range Search With Valid Min And Max Value", () => {

    it("should return a response with 200 status", async () => {
        const res = new ResponseMock()
        const response = await searchController.search(60, 200, "", "", res, context);
        expect(JSON.parse(response).data.length).toBe(5)
        expect(JSON.parse(response).status).toBe(200);
    });

});

describe("Test Price Range Search With Invalid Min Value Greater Than Max Value ", () => {

    it("should return an error message with 400 status", async () => {
        const res = new ResponseMock()
        const response = await searchController.search(6000, 200, "", "", res, context);
        expect(JSON.parse(response).status).toBe(400);
        expect(JSON.parse(response).data).toStrictEqual({message: "Max price should be greater than Min price"});
    });

});

describe("Test Price Range Search With Negative Range Value", () => {

    it("should return an error message with 400 status", async () => {
        const res = new ResponseMock()
        const response = await searchController.search(-100, 200, "", "", res, context);
        expect(JSON.parse(response).status).toBe(400);
        expect(JSON.parse(response).data).toStrictEqual({message: "Prices should not be negative"});
    });
});

describe("Test Price Range Search With Valid Min And Max Value But No Products In Range", () => {

    it("should return empty array with 200 status", async () => {
        const res = new ResponseMock()
        const response = await searchController.search(1, 7, "", "", res, context);
        expect(JSON.parse(response).data.length).toBe(0)
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual([])
    });
});

describe("Test Category Search With Valid Category", () => {

    it("should return all products in that category with 200 status", async () => {
        const selectedCategory = Category.VEHICLES;
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, "", selectedCategory, res, context);
        expect(JSON.parse(response).data.length).toBe(3)
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data[0].category).toStrictEqual(selectedCategory)
        expect(JSON.parse(response).data[1].category).toStrictEqual(selectedCategory)
        expect(JSON.parse(response).data[2].category).toStrictEqual(selectedCategory)
    });
});

describe("Test Category Search With No Matching Product Category", () => {

    it("should return empty array with 200 status", async () => {
        const selectedCategory = Category.TOYS;
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, "", selectedCategory, res, context);
        expect(JSON.parse(response).data.length).toBe(0)
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual([])
    });
});

describe("Test Category Search With Invalid Category", () => {

    it("should return an error message with 400 status", async () => {
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, "", "SCHOOL", res, context);
        expect(JSON.parse(response).status).toBe(400);
        expect(JSON.parse(response).data).toStrictEqual({message: "Not valid category"});
    });

});

describe("Test Name Search With Valid Word And Products with Word In Name", () => {

    it("should return all products containing word in name with 200 status", async () => {
        const word = "cake";
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, word, "", res, context);
        expect(JSON.parse(response).data.length).toBe(2)
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data[0].name).toStrictEqual(products[0].name)
        expect(JSON.parse(response).data[1].name).toStrictEqual(products[1].name)
    });
});

describe("Test Name Search With Valid Word And Products Without Word In Name", () => {

    it("should return empty list with 200 status", async () => {
        const word = "toy";
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, word, "", res, context);
        expect(JSON.parse(response).data.length).toBe(0)
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual([])
    });
});

describe("Test Name Search When Receives Words And Numbers", () => {

    it("should return product with number with 200 status", async () => {
        const word = "12";
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, word, "", res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data.length).toBe(1)
        expect(JSON.parse(response).data[0].name).toStrictEqual(productDto6.name)
    });
});

describe("Test Name And Category Search", () => {

    it("should return products which satisfy both name and category conditions with 200 status", async () => {
        const word = "phone";
        const selectedCategory = Category.PHONES;
        const res = new ResponseMock()
        const response = await searchController.search(0, 99999999999, word, selectedCategory, res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data.length).toBe(3)
        expect(JSON.parse(response).data[0].name).toBe(products[5].name)
        expect(JSON.parse(response).data[1].name).toBe(products[6].name)
        expect(JSON.parse(response).data[2].name).toBe(products[7].name)
    });
});

describe("Test Name And Price Search", () => {

    it("should return products which satisfy both name and price conditions with 200 status", async () => {
        const word = "phone";
        const res = new ResponseMock()
        const response = await searchController.search(1000, 2500, word, "", res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data.length).toBe(2)
        expect(JSON.parse(response).data[0].name).toBe(products[6].name)
        expect(JSON.parse(response).data[1].name).toBe(products[7].name)

    });
});

describe("Test Category And Price Search", () => {

    it("should return products which satisfy both price and category conditions with 200 status", async () => {
        const minPrice = 5;
        const maxPrice = 140;
        const selectedCategory = Category.SUPERMARKETS;
        const res = new ResponseMock()
        const response = await searchController.search(minPrice, maxPrice, "", selectedCategory, res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data.length).toBe(2)
        expect(JSON.parse(response).data[0].name).toBe(products[0].name)
        expect(JSON.parse(response).data[1].name).toBe(products[2].name)
    });
});

describe("Test Name, Price and Category Search", () => {

    it("should return products which satisfy all name, price and category conditions ", async () => {
        const word = "phone";
        const minPrice = 10;
        const maxPrice = 2500;
        const selectedCategory = Category.TECHNOLOGY;

        const res = new ResponseMock()
        const response = await searchController.search(minPrice, maxPrice, word, selectedCategory, res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data.length).toBe(1)
        expect(JSON.parse(response).data[0].priceHistory[JSON.parse(response).data[0].priceHistory.length-1].price).toBeGreaterThan(10)
        expect(JSON.parse(response).data[0].priceHistory[JSON.parse(response).data[0].priceHistory.length-1].price).toBeLessThan(2500)
        expect(JSON.parse(response).data[0].category).toBe(Category.TECHNOLOGY)
        expect(JSON.parse(response).data[0].name).toBe(products[8].name)
    });
});
