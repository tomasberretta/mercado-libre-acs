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


import Product from "../../../main/model/entity/Product";
import {Category} from "../../../main/model/entity/Category";
import PriceRangeFilter from "../../../main/model/filter/PriceRangeFilter";

const priceRangeFilter = new PriceRangeFilter();

describe("Price Range Filter With Valid Min And Max Value", () => {

    it("should return all products with price between min and max value", async () => {
        const products = [
            new Product("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new Product("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new Product("Cookies", "with chips",75,Category.SUPERMARKETS),
            new Product("Car", "Red",1000000000,Category.VEHICLES),
            new Product("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = priceRangeFilter.filter(products,{minPrice:60,maxPrice:200})
        expect(filteredProducts.length).toBe(3)
    });

});

describe("Price Range Filter With Invalid Min And Max Value", () => {

    it("should throw error", async () => {
        const products = [
            new Product("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new Product("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new Product("Cookies", "with chips",75,Category.SUPERMARKETS),
            new Product("Car", "Red",1000000000,Category.VEHICLES),
            new Product("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]
        try {
            priceRangeFilter.filter(products, {minPrice: 6000, maxPrice: 200})
        }catch (error){
            expect(error).toHaveProperty('message', "Max price should be greater than Min price")
        }
        expect.assertions(1)

    });

});

describe("Price Range Filter With Invalid Min And Max Value", () => {

    it("should throw error", async () => {
        const products = [
            new Product("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new Product("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new Product("Cookies", "with chips",75,Category.SUPERMARKETS),
            new Product("Car", "Red",1000000000,Category.VEHICLES),
            new Product("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        try {
            priceRangeFilter.filter(products,{minPrice:-10,maxPrice:200})
        }catch (error){
            expect(error).toHaveProperty('message', "Prices should not be negative")
        }

        expect.assertions(1)

    });

});

describe("Price Range Filter With Valid Min And Max Value But No Products In Range", () => {

    it("should return empty array", async () => {
        const products = [
            new Product("Cake", "Chocolate",100,Category.SUPERMARKETS),
            new Product("Big cake", "Vanilla",150,Category.SUPERMARKETS),
            new Product("Cookies", "with chips",75,Category.SUPERMARKETS),
            new Product("Car", "Red",1000000000,Category.VEHICLES),
            new Product("Gummy bears", "Candy",10,Category.SUPERMARKETS),
        ]

        const filteredProducts = priceRangeFilter.filter(products,{minPrice:1,maxPrice:7})
        expect(filteredProducts.length).toBe(0)
    });

});


