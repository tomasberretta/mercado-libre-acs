import { Router } from 'express';
import productRouter from "./routes/ProductRouter";

const routes = Router();

routes.use('/product', productRouter);

export default routes;