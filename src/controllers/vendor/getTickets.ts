import type { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';

export default async function getTickets(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const tickets = await ticketsCollection().find({ vendor_email: email }).sort({ updated_at: -1 }).toArray();
    res.send(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    });
  }
}
