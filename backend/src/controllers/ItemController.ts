import { Request, Response } from 'express';

import knex from '../database/connection';

export async function index(
  request: Request,
  response: Response
): Promise<Response> {
  const items = await knex('items').select('*');

  const serializedItems = items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:8000/uploads/${item.image}`,
    };
  });

  return response.json(serializedItems);
}