import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function getSingleTicket(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ticket = await ticketsCollection().findOne({ _id: new ObjectId(id) });

    res.send(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_ERRORS', message: 'Error while fetching ticket data' });
  }
}
