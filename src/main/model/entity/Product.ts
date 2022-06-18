import {Category} from "./Category";

export default class ProductEntity {
    name : string;
    description : string;
    priceHistory : PriceEntity[];
    category : Category;

    constructor(name:string, description:string, price:number, category:Category) {
        this.name = name;
        this.description = description;
        this.priceHistory = [new PriceEntity(price)];
        this.category = category;
    }
}

class PriceEntity {
    price : number;
    date : Date;

    constructor(price:number) {
        this.price = price;
        this.date = new Date();
    }
}