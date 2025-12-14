import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { bookingsCollection, ticketsCollection } from '../../connections/mongodb.connection.js';
import stripe from '../../utils/stripe.utils.js';

export default async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { booking_id } = req.body;
    const bookedTicket = await bookingsCollection().findOne({ _id: new ObjectId(booking_id) });

    if (!bookedTicket)
      return res.status(404).send({ code: 'TICKET_NOT_FOUND', message: 'Ticket not found' });
    if (bookedTicket.status === 'pending')
      return res
        .status(400)
        .send({ code: 'TICKET_PENDING', message: 'Pending tickets payment not allowed' });
    if (bookedTicket.status === 'paid')
      return res
        .status(400)
        .send({ code: 'TICKET_PAID', message: 'Paid tickets repayment not allowed' });

    const ticket = await ticketsCollection().findOne({ _id: new ObjectId(bookedTicket.ticket_id) });
    if (!ticket)
      return res.status(404).send({ code: 'TICKET_NOT_FOUND', message: 'Ticket not found' });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'BDT',
            unit_amount: ticket.price * 100,
            product_data: {
              name: `Ticket: ${ticket?.title}`,
            },
          },
          quantity: bookedTicket.quantity,
        },
      ],
      metadata: {
        booking_id: booking_id,
        ticket_id: ticket._id.toString(),
      },
      customer_email: bookedTicket.user_email,
      mode: 'payment',
      success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
    });

    res.send({ url: session.url });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while creating checkout session' });
  }
}
