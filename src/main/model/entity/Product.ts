import {Category} from "./Category";

export default class ProductEntity {
    name : string;
    description : string;
    price : number;
    category : Category;

    constructor(name:string, description:string, price:number, category:Category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }
}