import { Router } from 'express';
import productRouter from "./routes/ProductRouter";
import cashierRouter from "./routes/CashierRouter";
import searchRouter from "./routes/SearchRouter";

const routes = Router();

routes.use('/product', productRouter);
routes.use('/cashier', cashierRouter);
routes.use('/search', searchRouter);

export default routes;