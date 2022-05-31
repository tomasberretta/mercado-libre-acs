import express from 'express';
import routes from './index';

const app = express();

app.use(express.raw({ type: 'application/json' }));

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`REST API server ready`),
);