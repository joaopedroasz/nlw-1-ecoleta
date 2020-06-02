import express from 'express';
import { resolve } from 'path';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

app.listen(8000);
