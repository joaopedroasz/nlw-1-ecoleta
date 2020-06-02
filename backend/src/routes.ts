import { Router } from 'express';

import * as CollectionPointsController from './controllers/CollectionPointsController';
import * as ItemController from './controllers/ItemController';

const routes = Router();

routes.get('/items', ItemController.index);

routes.post('/points', CollectionPointsController.store);

export default routes;
