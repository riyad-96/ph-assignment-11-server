import type { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function updateTicketStatus(req: Request, res: Response) {
  try {
    const { ticket_id, new_status } = req.body;

    const ticketColl = ticketsCollection();

    await ticketColl.findOneAndUpdate(
      { _id: new ObjectId(ticket_id) },
      { $set: { status: new_status, updated_at: new Date() } },
    );

    res.send({ code: 'TICKET_STATUS_UPDATED', message: 'Ticket status updated successfully' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while updating ticket status' });
  }
}
