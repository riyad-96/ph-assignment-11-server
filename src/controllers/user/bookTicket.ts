import { Request, Response } from 'express';
import { ticketsCollection, bookingsCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';
import { isPast } from 'date-fns';

export default async function bookTicket(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const { quantity, ticket_id } = req.body;

    if (Number(quantity) < 1)
      return res
        .status(400)
        .send({ code: 'INVALID_QUANTITY', message: 'User must book at least 1 ticket' });

    const requestedTicket = await ticketsCollection().findOne({ _id: new ObjectId(ticket_id) });
    if (!requestedTicket)
      return res
        .status(404)
        .send({ code: 'TICKET_NOT_FOUND', message: 'Expected ticket not found' });

    // check if departure time has passed or not
    if (isPast(requestedTicket.departure_time))
      return res
        .status(404)
        .send({ code: 'TICKET_EXPIRED', message: "Expected ticket's departure time has passed" });

    // book users ticket
    const bookingResponse = await bookingsCollection().insertOne({
      user_email: email,
      vendor_email: requestedTicket.vendor_email,
      ticket_id: new ObjectId(ticket_id),
      quantity: Number(quantity),
      created_at: new Date(),
      status: 'pending',
    });
    if (!bookingResponse.acknowledged) return;

    // reduce ticket quantity from this ticket
    const decreamentCount = -Math.ceil(Number(quantity));
    await ticketsCollection().findOneAndUpdate(
      { _id: new ObjectId(ticket_id) },
      {
        $inc: {
          quantity: decreamentCount,
        },
      },
    );

    res.send('ticket-successfully-booked');
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'BOOKING_FAILED', message: 'Error while booking new ticket' });
  }
}
