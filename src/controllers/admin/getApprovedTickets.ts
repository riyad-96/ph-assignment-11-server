import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';

export default async function getApprovedTickets(req: Request, res: Response) {
  try {
    const approvedTickets = await ticketsCollection()
      .find({ status: 'approved' })
      .sort({ updated_at: -1 })
      .toArray();
    res.send(approvedTickets);
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
}
