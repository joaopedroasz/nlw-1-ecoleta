import { Router } from 'express';

import CollectionPointsController from './controllers/CollectionPointsController';
import ItemsController from './controllers/ItemsController';

const routes = Router();

const itemsController = new ItemsController();
routes.get('/items', itemsController.index);

const collectionPointsController = new CollectionPointsController();
routes.post('/points', collectionPointsController.store);
routes.get('/points', collectionPointsController.index);
routes.get('/points/:id', collectionPointsController.show);

export default routes;
