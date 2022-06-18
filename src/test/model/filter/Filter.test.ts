/*
*
* - Price Range Filter should return all products with current price between 2 values
* - Price Range Filter if min is greater than max should return error
* - Price Range should return error if given negative values
* - Price Range if no products are found with that price range should return empty array
*
* - Category Filter should return array with products with selected category
* - Category Filter should return empty array if no products are found with that category
* - Category Filter should only accept valid categories from model
*
* - Name Filter should return all products containing a word in the product name
* - Name Filter should return empty array if no products are found with that name
* - Name Filter should accept letters and numbers
*
* - Filter can be combined and all should be applied to product list
* */


import ProductEntity from "../../../main/model/entity/Product";
import {Category} from "../../../main/model/entity/Category";
import PriceRangeFilter from "../../../main/model/filter/PriceRangeFilter";
import CategoryFilter from "../../../main/model/filter/CategoryFilter";
import NameFilter from "../../../main/model/filter/NameFilter";

const priceRangeFilter = new PriceRangeFilter();
const categoryFilter = new CategoryFilter();
const nameFilter = new NameFilter();

describe("Price Range Filter With Valid Min And Max Value", () => {

    it("should return all products with price between min and max value", async () => {
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = priceRangeFilter.filterEntity(products,{minPrice:60,maxPrice:200})
        expect(filteredProducts.length).toBe(3)
    });

});

describe("Price Range Filter With Invalid Min Value Greater Than Max Value ", () => {

    it("should throw error", async () => {
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]
        try {
            priceRangeFilter.filterEntity(products, {minPrice: 6000, maxPrice: 200})
        }catch (error){
            expect(error).toHaveProperty('message', "Max price should be greater than Min price")
        }
        expect.assertions(1)

    });

});

describe("Price Range Filter With Negative Range Value", () => {

    it("should throw error", async () => {
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        try {
            priceRangeFilter.filterEntity(products,{minPrice:-10,maxPrice:200})
        }catch (error){
            expect(error).toHaveProperty('message', "Prices should not be negative")
        }

        expect.assertions(1)

    });

});

describe("Price Range Filter With Valid Min And Max Value But No Products In Range", () => {

    it("should return empty array", async () => {
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = priceRangeFilter.filterEntity(products,{minPrice:1,maxPrice:7})
        expect(filteredProducts.length).toBe(0)
    });

});

describe("Category Filter With Valid Category", () => {

    it("should return all products in that category", async () => {
        const selectedCategory = Category.VEHICLES;
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = categoryFilter.filterEntity(products,{category: "VEHICLES"})
        expect(filteredProducts.length).toBe(1)
        expect(filteredProducts[0].category).toBe(selectedCategory)

    });
});

describe("Category Filter With No Matching Product Category", () => {

    it("should return empty array", async () => {
        const selectedCategory = Category.TOYS;
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = categoryFilter.filterEntity(products,{category: selectedCategory})
        expect(filteredProducts.length).toBe(0)
    });
});

describe("Category Filter With Invalid Category", () => {

    it("should throw error", async () => {
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        try {
            categoryFilter.filterEntity(products,{category: "SCHOOL"})
        }catch (error){
            expect(error).toHaveProperty('message', "Not valid category")
        }

        expect.assertions(1)
    });

});

describe("Name Filter With Valid Word And Products with Word In Name", () => {

    it("should return all products containing word in name", async () => {
        const word = "cake";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        expect(filteredProducts.length).toBe(2)
        expect(filteredProducts[0].name).toBe(products[0].name)
        expect(filteredProducts[1].name).toBe(products[1].name)
    });
});


describe("Name Filter With Valid Word And Products Without Word In Name", () => {

    it("should return empty list", async () => {
        const word = "phone";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        expect(filteredProducts.length).toBe(0)
    });
});

describe("Name Filter When Receives Words And Numbers", () => {

    it("should return product with number", async () => {
        const word = "12";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
            new ProductEntity("IPhone 12", "Silver",2000,Category.TECHNOLOGY),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        expect(filteredProducts.length).toBe(1)
    });
});

describe("Name Filter With Invalid Characters", () => {

    it("should return empty list", async () => {
        const word = "@/!$%^&*()_+";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
            new ProductEntity("IPhone 12", "Silver",2000,Category.TECHNOLOGY),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        expect(filteredProducts.length).toBe(0)

        // try {
        //     categoryFilter.filter(products,{category: "PHONES"})
        // }catch (error){
        //     expect(error).toHaveProperty('message', "Not valid category")
        // }
        //
        // expect.assertions(1)
    });
});

describe("When Using Name And Category Filter", () => {

    it("should return products which satisfy both name and category conditions ", async () => {
        const word = "phone";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
            new ProductEntity("IPhone 12", "Silver",2000,Category.PHONES),
            new ProductEntity("IPhone 11", "Gold",2000,Category.PHONES),
            new ProductEntity("IPhone 508", "Silver",2000,Category.PHONES),
            new ProductEntity("IPhone 508 Adapter", "Silver",2000,Category.TECHNOLOGY),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        const filteredProducts2 = categoryFilter.filterEntity(filteredProducts,{category: "PHONES"})

        expect(filteredProducts2.length).toBe(3)
        expect(filteredProducts2[0].name).toBe(products[5].name)
        expect(filteredProducts2[1].name).toBe(products[6].name)
        expect(filteredProducts2[2].name).toBe(products[7].name)

    });
});

describe("When Using Name And Price Filter", () => {

    it("should return products which satisfy both name and price conditions ", async () => {
        const word = "phone";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
            new ProductEntity("IPhone 12", "Silver",4000,Category.PHONES),
            new ProductEntity("IPhone 11", "Gold",2000,Category.PHONES),
            new ProductEntity("IPhone 508", "Silver",1500,Category.PHONES),
            new ProductEntity("IPhone 508 Adapter", "Silver",200,Category.TECHNOLOGY),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        const filteredProducts2 = priceRangeFilter.filterEntity(filteredProducts,{minPrice: 1000, maxPrice: 2500})

        expect(filteredProducts2.length).toBe(2)
        expect(filteredProducts2[0].name).toBe(products[6].name)
        expect(filteredProducts2[1].name).toBe(products[7].name)

    });
});

describe("When Using Category And Price Filter", () => {

    it("should return products which satisfy both price and category conditions ", async () => {
        const minPrice = 5;
        const maxPrice = 140;
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Android J1", "Black",10,Category.PHONES),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Car 1886 Model", "Old",100,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
            new ProductEntity("IPhone 12", "Silver",2000,Category.PHONES),
            new ProductEntity("IPhone 11", "Gold",2000,Category.PHONES),
            new ProductEntity("IPhone 508", "Silver",2000,Category.PHONES),
            new ProductEntity("IPhone 508 Adapter", "Silver",2000,Category.TECHNOLOGY),
        ]

        const filteredProducts = priceRangeFilter.filterEntity(products,{minPrice: minPrice, maxPrice: maxPrice})
        const filteredProducts2 = categoryFilter.filterEntity(filteredProducts,{category: "SUPERMARKETS"})


        expect(filteredProducts2.length).toBe(3)
        expect(filteredProducts2[0].name).toBe(products[0].name)
        expect(filteredProducts2[1].name).toBe(products[3].name)
        expect(filteredProducts2[2].name).toBe(products[6].name)


    });
});


describe("When Using Name, Category And Price Filter", () => {

    it("should return products which satisfy all name, price and category conditions ", async () => {
        const word = "phone";
        const products = [
            new ProductEntity("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new ProductEntity("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new ProductEntity("Cookies", "with chips",75,Category.SUPERMARKETS),
            new ProductEntity("Car", "Red",1000000000,Category.VEHICLES),
            new ProductEntity("Gummy bears", "Candy",10,Category.SUPERMARKETS),
            new ProductEntity("IPhone 12", "Silver",4000,Category.PHONES),
            new ProductEntity("IPhone 11", "Gold",2000,Category.PHONES),
            new ProductEntity("IPhone 508", "Silver",1500,Category.PHONES),
            new ProductEntity("IPhone 508 Adapter", "Silver",200,Category.TECHNOLOGY),
        ]

        const filteredProducts = nameFilter.filterEntity(products,{word: word})
        const filteredProducts2 = priceRangeFilter.filterEntity(filteredProducts,{minPrice: 10, maxPrice: 2500})
        const filteredProducts3 = categoryFilter.filterEntity(filteredProducts2, {category: "TECHNOLOGY"})

        expect(filteredProducts3.length).toBe(1)
        expect(filteredProducts3[0].priceHistory[filteredProducts3[0].priceHistory.length-1].price).toBeGreaterThan(10)
        expect(filteredProducts3[0].priceHistory[filteredProducts3[0].priceHistory.length-1].price).toBeLessThan(2500)
        expect(filteredProducts3[0].category).toBe(Category.TECHNOLOGY)
        expect(filteredProducts3[0].name).toBe(products[8].name)
    });
});


