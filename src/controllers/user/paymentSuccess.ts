import { Request, Response } from 'express';
import stripe from '../../utils/stripe.utils.js';
import { ObjectId } from 'mongodb';
import {
  bookingsCollection,
  ticketsCollection,
  transactionsCollection,
} from '../../connections/mongodb.connection.js';
import type { Transaction } from './types.d.js';

export default async function paymentSuccess(req: Request, res: Response) {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session)
      return res.status(404).send({ code: 'SESSION_NOT_FOUND', message: 'Session not found' });

    const ticket = await ticketsCollection().findOne({
      _id: new ObjectId(session.metadata?.ticket_id),
    });

    const transaction = await transactionsCollection().findOne({ session_id });
    if (transaction)
      return res.send({
        code: 'TRANSACTION_EXISTS',
        message: 'Transaction already exists',
        data: { ticket_title: ticket?.title },
      });

    if (session.payment_status !== 'paid')
      return res.status(400).send({ code: 'PAYMENT_FAILED', message: 'Payment failed' });

    const booking_id = session.metadata?.booking_id;
    const booking = await bookingsCollection().findOne({ _id: new ObjectId(booking_id) });
    if (!booking)
      return res.status(404).send({ code: 'BOOKING_NOT_FOUND', message: 'Booking not found' });
    if (booking?.status === 'paid')
      return res.send({
        code: 'TICKET_PAID',
        message: 'Ticket already paid',
        data: { ticket_title: ticket?.title },
      });

    await bookingsCollection().findOneAndUpdate(
      { _id: new ObjectId(booking_id) },
      { $set: { status: 'paid' } },
      { returnDocument: 'after' },
    );

    const newTransaction: Transaction = {
      user_email: booking.user_email,
      vendor_email: booking.vendor_email,
      amount: (session.amount_total as number) / 100,
      transaction_id: session.payment_intent as string,
      session_id,
      ticket_id: booking.ticket_id,
      booking_id: new ObjectId(booking_id),
      created_at: new Date(),
    };

    await transactionsCollection().insertOne(newTransaction);

    res.send({
      code: 'PAYMENT_SUCCESS',
      message: 'Payment successful',
      data: {
        ticket_title: ticket?.title,
        quantity: booking.quantity,
        total_price: (session.amount_total as number) / 100,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while processing payment' });
  }
}
