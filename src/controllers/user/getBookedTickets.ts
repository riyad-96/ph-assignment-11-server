import { Request, Response } from 'express';
import { ticketsCollection, bookingsCollection } from '../../connections/mongodb.connection.js';

export default async function getBookedTickets(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    // get all the bookings
    const bookings = await bookingsCollection().find({ user_email: email }).toArray();
    if (bookings.length < 1) res.send([]);

    // get all ticket liked with each booking
    const ticketIds = bookings.map((b) => b.ticket_id);
    const tickets = await ticketsCollection()
      .find({ _id: { $in: ticketIds } })
      .toArray();

    const sanitizedBookedTickets = bookings.map((b) => {
      const ticket = tickets.find((t) => t._id.toString() === b.ticket_id.toString());
      const bookedTicket = {
        _id: b._id,
        departure_time: ticket?.departure_time,
        from: ticket?.from,
        to: ticket?.to,
        price: ticket?.price,
        quantity: b.quantity,
        thumbnail: ticket?.thumbnail,
        title: ticket?.title,
        total_price: b.quantity * (ticket?.price as number),
        status: b.status,
      };
      return bookedTicket;
    });

    res.send(sanitizedBookedTickets);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_ERRORS', message: 'Error while fetching booked ticket data' });
  }
}
