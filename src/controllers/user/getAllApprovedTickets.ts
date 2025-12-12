import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';

export default async function getAllApprovedTickets(req: Request, res: Response) {
  try {
    const approvedTickets = await ticketsCollection()
      .find({ status: 'approved' })
      .sort({ created_at: -1 })
      .toArray();
    res.send(approvedTickets);
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_ERRORS', message: 'Error while fetching ticket data' });
  }
}
