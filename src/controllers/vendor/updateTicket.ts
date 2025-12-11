import type { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import { Ticket } from './Types.js';
import { ObjectId } from 'mongodb';

export default async function updateTicket(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const ticket: Ticket = req.body;

    const requestTedTicket = await ticketsCollection().findOne({
      vendor_email: email,
      _id: new ObjectId(ticket._id),
    });

    await ticketsCollection().findOneAndUpdate(
      {
        vendor_email: email,
        _id: new ObjectId(ticket._id),
      },
      {
        $set: {
          from: ticket.from,
          to: ticket.to,
          price: parseFloat(ticket.price as string),
          quantity: Math.floor(parseFloat(ticket.quantity as string)),
          departure_time: new Date(ticket.departure_time),
          perks: ticket.perks,
          status: requestTedTicket?.status,
          thumbnail: ticket.thumbnail,
          title: ticket.title,
          transport: ticket.transport,
        },
      },
    );
    res.send({ code: 'TICKET_UPDATED', message: 'Ticket was successfully updated' });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'TICKET_UPDATE_FAILED',
      message: 'Error while updating Ticket informations.',
    });
  }
}
