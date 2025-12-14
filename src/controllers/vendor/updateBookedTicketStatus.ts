import { Request, Response } from 'express';
import { bookingsCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function updateBookedTicketStatus(req: Request, res: Response) {
  try {
    const { booked_ticket_id, status } = req.body;

    const ticket = await bookingsCollection().findOne({ _id: new ObjectId(booked_ticket_id) });
    if (!ticket)
      return res.status(404).send({ code: 'TICKET_NOT_FOUND', message: 'Ticket not found' });
    if (ticket.status === 'paid')
      return res
        .status(400)
        .send({ code: 'TICKET_PAID', message: 'Paid tickets cannot be updated' });

    await bookingsCollection().findOneAndUpdate(
      { _id: new ObjectId(booked_ticket_id) },
      { $set: { status } },
    );

    res.send({
      code: 'BOOKED_TICKET_STATUS_UPDATED',
      message: 'Booked ticket status updated successfully',
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while updating booked ticket data' });
  }
}
