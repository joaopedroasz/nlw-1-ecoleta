import { Request, Response } from 'express';

import knex from '../database/connection';

class CollectionPointsController {
  async index(request: Request, response: Response): Promise<Response> {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const collectionPoints = await knex('collection_points')
      .join(
        'point_items',
        'collection_points.id',
        '=',
        'point_items.collection_point_id'
      )
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('collection_points.*');

    return response.json({ collectionPoints });
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const collectionPoint = await knex('collection_points')
      .where('id', id)
      .first();

    if (!collectionPoint) {
      return response.status(400).json({ error: 'Collection Point not found' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.collection_point_id', id)
      .select('items.title');

    return response.status(200).json({ collectionPoint, items });
  }

  async store(request: Request, response: Response): Promise<Response> {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    } = request.body;

    const items: number[] = request.body.items;

    const trx = await knex.transaction();

    const collectionPoint = {
      image:
        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const InsertedCollectionPointId = await trx('collection_points').insert(
      collectionPoint
    );

    const collection_point_id = InsertedCollectionPointId[0];

    const pointItems = items.map((item_id) => ({
      item_id,
      collection_point_id,
    }));

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      id: collection_point_id,
      ...collectionPoint,
    });
  }
}

export default CollectionPointsController;
