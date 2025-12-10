import type { Request, Response } from 'express';
import { ticketsCollection, usersCollection } from '../../connections/mongodb.connection.js';
import { Ticket } from './Types.js';

export default async function createTicket(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const vendor = await usersCollection().findOne({ email });

    if (!vendor)
      return res.status(404).send({
        code: 'VENDOR_NOT_FOUND',
        message: 'Vendor account not found',
      });

    if (vendor?.isFraud)
      return res.status(403).send({
        code: 'VENDOR_IS_FRAUD',
        message: 'Access denied. This vendor account is marked as fraud',
      });

    const ticket = req.body;

    const newTicket: Ticket = {
      vendor_email: vendor.email,
      vendor_name: vendor.name,
      title: ticket.title,
      thumbnail: ticket.thumbnail,
      status: 'pending',
      from: ticket.from,
      to: ticket.to,
      transport: ticket.transport,
      price: parseFloat(ticket.price),
      quantity: Math.floor(parseFloat(ticket.quantity)),
      departure_time: new Date(ticket.departure_time),
      perks: ticket.perks,
    };

    await ticketsCollection().insertOne(newTicket);
    res.send({ code: 'TICKET_ADDED', messaeg: 'A new ticket was added in this vendor account' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while updating data' });
  }
}
