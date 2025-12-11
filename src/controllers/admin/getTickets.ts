import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';

export default async function getTickets(req: Request, res: Response) {
  try {
    const ticketColl = ticketsCollection();
    const allTickets = await ticketColl.find().sort({ created_at: -1 }).toArray();

    const pendingTickets = allTickets.filter(ticket => ticket.status === 'pending');
    const approvedTickets = allTickets.filter(ticket => ticket.status === 'approved');
    const rejectedTickets = allTickets.filter(ticket => ticket.status === 'rejected');

    const sortedTickets = [...pendingTickets, ...approvedTickets, ...rejectedTickets];

    res.send(sortedTickets);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while fetching tickets' });
  }
}
