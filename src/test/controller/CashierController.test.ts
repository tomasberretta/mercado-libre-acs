import { MockContext, Context, createMockContext } from '../../resources/Context';
import ResponseMock from "../resources/ResponseMock";
import {Category, PayingMethod} from "@prisma/client";
import ProductService from "../../main/service/ProductService";
import ProviderService from "../../main/service/ProviderService";
import CashierController from "../../main/controller/CashierController";
import SuccessMerchantProcessor from "../../main/api/SuccessMerchantProcessor";
import ErrorMerchantProcessor from "../../main/api/ErrorMerchantProcessor";

const cashierController = new CashierController()

const productService = new ProductService();
const providerService = new ProviderService();

let mockContext: MockContext
let context: Context

beforeAll(async () => {
    mockContext = createMockContext()
    context = mockContext as unknown as Context
})

describe("Test checkout with Success Merchant Processor", () => {

    it("should return a response with 200 status", async () => {

        const providerDto = {
            id: 1,
            name: "ChairsAndTables",
            email: null,
            phone: null,
        }
        mockContext.prisma.provider.create.mockResolvedValue(providerDto)
        const provider = await providerService.addProvider(providerDto.name, context);

        const res = new ResponseMock()
        const merchantProcessor = new SuccessMerchantProcessor()
        const payingMethod = PayingMethod.DEBIT_CARD

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

        mockContext.prisma.product.create.mockResolvedValue(productDto1)
        const product1 = await productService.addProduct(productDto1, context);
        mockContext.prisma.product.create.mockResolvedValue(productDto2)
        const product2 = await productService.addProduct(productDto2, context);

        const cartDto3 = {
            id: 3,
            userId: 1,
            products: [{id: 1, productId: product1.id}, {id: 2, productId: product2.id}]
        }
        mockContext.prisma.cart.findFirst.mockResolvedValue(cartDto3);

        const productStockDto1 = {
            id: 1,
            name: "Chair",
            description: "Blue Table",
            stock: {id:1, stock: 43},
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
            stockId: 1,
            invoiceId: null
        }
        const productStockDto2 = {
            id: 1,
            name: "Chair",
            description: "Red chair",
            stock: {id:2, stock: 17},
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 120,
            stockId: 2,
            invoiceId: null
        }

        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto1);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto2);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto1);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto2);

        const priceDto1 = {
            id: 1,
            price: 100,
            date: new Date(),
            productId: 1
        }
        const priceDto2 = {
            id: 2,
            price: 120,
            date: new Date(),
            productId: 2
        }
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto1]);
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto2]);

        const invoiceDto = {
            id:1,
            cartId:3,
            amount:220,
            payingMethod: PayingMethod.MERCADO_PAGO,
            products: [product1.id, product2.id]
        }
        mockContext.prisma.invoice.create.mockResolvedValue(invoiceDto);

        const updatedCartDto = {
            id: 3,
            userId: 1,
            products: []
        }
        mockContext.prisma.cart.update.mockResolvedValue(updatedCartDto)

        const updatedStockDto = {
            id: 1,
            stock: 42,
            productId: 1
        }
        mockContext.prisma.stock.update.mockResolvedValue(updatedStockDto)
        const response = await cashierController.checkOut(1, merchantProcessor, payingMethod, res, context);
        expect(JSON.parse(response).status).toBe(200);
        expect(JSON.parse(response).data).toStrictEqual(invoiceDto);
    });

});

describe("Test checkout with Error Merchant Processor", () => {

    it("should return a response with 400 status", async () => {
        const providerDto = {
            id: 1,
            name: "ChairsAndTables",
            email: null,
            phone: null,
        }
        mockContext.prisma.provider.create.mockResolvedValue(providerDto)
        const provider = await providerService.addProvider(providerDto.name, context);

        const res = new ResponseMock()
        const merchantProcessor = new ErrorMerchantProcessor()
        const payingMethod = PayingMethod.CREDIT_CARD

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

        mockContext.prisma.product.create.mockResolvedValue(productDto1)
        const product1 = await productService.addProduct(productDto1, context);
        mockContext.prisma.product.create.mockResolvedValue(productDto2)
        const product2 = await productService.addProduct(productDto2, context);

        const cartDto3 = {
            id: 3,
            userId: 1,
            products: [{id: 1, productId: product1.id}, {id: 2, productId: product2.id}]
        }
        mockContext.prisma.cart.findFirst.mockResolvedValue(cartDto3);

        const productStockDto1 = {
            id: 1,
            name: "Chair",
            description: "Blue Table",
            stock: {id:1, stock: 43},
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 100,
            stockId: 1,
            invoiceId: null
        }
        const productStockDto2 = {
            id: 1,
            name: "Chair",
            description: "Red chair",
            stock: {id:2, stock: 17},
            providerId: provider.id,
            category: Category.SUPERMARKETS,
            price: 120,
            stockId: 2,
            invoiceId: null
        }

        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto1);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto2);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto1);
        mockContext.prisma.product.findFirst.mockResolvedValueOnce(productStockDto2);

        const priceDto1 = {
            id: 1,
            price: 100,
            date: new Date(),
            productId: 1
        }
        const priceDto2 = {
            id: 2,
            price: 120,
            date: new Date(),
            productId: 2
        }
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto1]);
        mockContext.prisma.price.findMany.mockResolvedValueOnce([priceDto2]);

        const invoiceDto = {
            id:1,
            cartId:3,
            amount:220,
            payingMethod: PayingMethod.MERCADO_PAGO,
            products: [product1.id, product2.id]
        }
        mockContext.prisma.invoice.create.mockResolvedValue(invoiceDto);

        const updatedCartDto = {
            id: 3,
            userId: 1,
            products: []
        }
        mockContext.prisma.cart.update.mockResolvedValue(updatedCartDto)

        const updatedStockDto = {
            id: 1,
            stock: 42,
            productId: 1
        }
        mockContext.prisma.stock.update.mockResolvedValue(updatedStockDto)
        const response = await cashierController.checkOut(1, merchantProcessor, payingMethod, res, context);
        expect(JSON.parse(response).status).toBe(400);
        expect(JSON.parse(response).data).toStrictEqual({message: "An error occurred processing payment"});
    });

});