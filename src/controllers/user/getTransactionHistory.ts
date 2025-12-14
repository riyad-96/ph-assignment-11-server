import { Request, Response } from 'express';
import { ticketsCollection, transactionsCollection } from '../../connections/mongodb.connection.js';

export default async function getTransactionHistory(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const transactions = await transactionsCollection()
      .find({ user_email: email })
      .sort({ created_at: -1 })
      .toArray();

    const ticketIds = transactions.map((t) => t.ticket_id);

    const tickets = await ticketsCollection()
      .find({ _id: { $in: ticketIds } })
      .toArray();

    const sanitizedTransactions = transactions.map((t) => {
      const ticket = tickets.find((ticket) => ticket._id.toString() === t.ticket_id.toString());
      const sanitizedTransaction = {
        transaction_id: t.transaction_id,
        amount: t.amount,
        ticket_title: ticket?.title,
        payment_date: t.created_at,
      };
      return sanitizedTransaction;
    });

    res.send(sanitizedTransactions);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while fetching transaction history' });
  }
}
