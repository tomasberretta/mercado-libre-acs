import {Context, createMockContext, MockContext} from "../../resources/Context";
import SearchService from "../../main/service/SearchService";
import {Category} from "../../main/model/entity/Category";

const searchService = new SearchService();

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

    it("should return an array with 3 products", async () => {
        const validProducts = await searchService.search(60, 200, "", "", context);
        expect(validProducts.length).toBe(5)
    });

});

describe("Test Price Range Search With Invalid Min Value Greater Than Max Value ", () => {

    it("should throw error", async () => {
        try {
            await searchService.search( 6000, 200, "", "", context);
        }catch (error){
            expect(error).toHaveProperty('message', "Max price should be greater than Min price")
        }
        expect.assertions(1)
    });

});

describe("Test Price Range Search With Negative Range Value", () => {

    it("should throw error", async () => {
        try {
            await searchService.search( -100, 200, "", "", context);
        }catch (error){
            expect(error).toHaveProperty('message', "Prices should not be negative")
        }
        expect.assertions(1)
    });

});

describe("Test Price Range Search With Valid Min And Max Value But No Products In Range", () => {

    it("should return empty array", async () => {
        const validProducts = await searchService.search(1, 7, "", "", context);
        expect(validProducts.length).toBe(0)
    });

});

describe("Test Category Search With Valid Category", () => {

    it("should return all products in that category", async () => {
        const selectedCategory = Category.VEHICLES;
        const validProducts = await searchService.search(0, 99999999999, "", selectedCategory, context);
        expect(validProducts.length).toBe(3)
        expect(validProducts[0].category).toBe(selectedCategory)
        expect(validProducts[1].category).toBe(selectedCategory)
        expect(validProducts[2].category).toBe(selectedCategory)
    });
});

describe("Test Category Search With No Matching Product Category", () => {

    it("should return empty array", async () => {
        const selectedCategory = Category.TOYS;
        const validProducts = await searchService.search(0, 99999999999, "", selectedCategory, context);
        expect(validProducts.length).toBe(0)
    });
});

describe("Test Category Search With Invalid Category", () => {

    it("should throw error", async () => {
        try {
            await searchService.search(0, 99999999999, "", "SCHOOL", context);
        }catch (error){
            expect(error).toHaveProperty('message', "Not valid category")
        }

        expect.assertions(1)
    });

});

describe("Test Name Search With Valid Word And Products with Word In Name", () => {

    it("should return all products containing word in name", async () => {
        const word = "cake";
        const validProducts = await searchService.search(0, 99999999999, word, "", context);
        expect(validProducts.length).toBe(2)
        expect(validProducts[0].name).toBe(products[0].name)
        expect(validProducts[1].name).toBe(products[1].name)
    });
});

describe("Test Name Search With Valid Word And Products Without Word In Name", () => {

    it("should return empty list", async () => {
        const word = "toy";
        const validProducts = await searchService.search(0, 99999999999, word, "", context);
        expect(validProducts.length).toBe(0)
    });
});

describe("Test Name Search When Receives Words And Numbers", () => {

    it("should return product with number", async () => {
        const word = "12";
        const validProducts = await searchService.search(0, 99999999999, word, "", context);
        expect(validProducts.length).toBe(1)
    });
});

describe("Test Name And Category Search", () => {

    it("should return products which satisfy both name and category conditions ", async () => {
        const word = "phone";
        const selectedCategory = Category.PHONES;

        const validProducts = await searchService.search(0, 99999999999, word, selectedCategory, context);

        expect(validProducts.length).toBe(3)
        expect(validProducts[0].name).toBe(products[5].name)
        expect(validProducts[1].name).toBe(products[6].name)
        expect(validProducts[2].name).toBe(products[7].name)

    });
});

describe("Test Name And Price Search", () => {

    it("should return products which satisfy both name and price conditions ", async () => {
        const word = "phone";
        const validProducts = await searchService.search(1000, 2500, word, "", context);
        expect(validProducts.length).toBe(2)
        expect(validProducts[0].name).toBe(products[6].name)
        expect(validProducts[1].name).toBe(products[7].name)

    });
});

describe("Test Category And Price Search", () => {

    it("should return products which satisfy both price and category conditions ", async () => {
        const minPrice = 5;
        const maxPrice = 140;
        const selectedCategory = Category.SUPERMARKETS;

        const validProducts = await searchService.search(minPrice, maxPrice, "", selectedCategory, context);

        expect(validProducts.length).toBe(2)
        expect(validProducts[0].name).toBe(products[0].name)
        expect(validProducts[1].name).toBe(products[2].name)
    });
});

describe("Test Name, Price and Category Search", () => {

    it("should return products which satisfy all name, price and category conditions ", async () => {
        const word = "phone";
        const minPrice = 10;
        const maxPrice = 2500;
        const selectedCategory = Category.TECHNOLOGY;

        const validProducts = await searchService.search(minPrice, maxPrice, word, selectedCategory, context);
        expect(validProducts.length).toBe(1)
        expect(validProducts[0].priceHistory[validProducts[0].priceHistory.length-1].price).toBeGreaterThan(10)
        expect(validProducts[0].priceHistory[validProducts[0].priceHistory.length-1].price).toBeLessThan(2500)
        expect(validProducts[0].category).toBe(Category.TECHNOLOGY)
        expect(validProducts[0].name).toBe(products[8].name)
    });
});