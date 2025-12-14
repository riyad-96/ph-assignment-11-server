import type { Request, Response } from 'express';
import {
  bookingsCollection,
  ticketsCollection,
  usersCollection,
} from '../../connections/mongodb.connection.js';

export default async function getBookedTickets(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;

    // get all the bookings
    const bookings = await bookingsCollection().find({ vendor_email: email }).toArray();
    if (bookings.length < 1) return res.send([]);

    // get all ticket linked with each booking
    const ticketIds = bookings.map((b) => b.ticket_id);
    const tickets = await ticketsCollection()
      .find({ _id: { $in: ticketIds } })
      .toArray();

    // all user liked with each booking
    const userIds = bookings.map((b) => b.user_email);
    const users = await usersCollection()
      .find({ email: { $in: userIds } })
      .toArray();

    const sanitizedVendorBookedTickets = bookings.map((b) => {
      const ticket = tickets.find((t) => t._id.toString() === b.ticket_id.toString());
      const user = users.find((u) => u.email === b.user_email);

      const bookedTicket = {
        _id: b._id,
        user_email: user?.email,
        user_name: user?.name,
        title: ticket?.title,
        quantity: b.quantity,
        total_price: b.quantity * (ticket?.price as number),
        created_at: b.created_at,
        status: b.status,
      };
      return bookedTicket;
    });
    console.log(sanitizedVendorBookedTickets);
    res.send(sanitizedVendorBookedTickets);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while fetching booked tickets data' });
  }
}
