import { Request, Response } from 'express';

import knex from '../database/connection';

export async function store(
  request: Request,
  response: Response
): Promise<Response> {
  const { name, email, whatsapp, latitude, longitude, city, uf } = request.body;

  const items: number[] = request.body.items;

  const CollectionPointId = await knex('collection_points').insert({
    image: 'image-fake',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  const pointItems = items.map((item_id) => ({
    item_id,
    collection_point_id: CollectionPointId[0],
  }));

  await knex('point_items').insert(pointItems);

  return response.json({ CollectionPointId });
}
