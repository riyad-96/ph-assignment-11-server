import { Request, Response } from 'express';
import {
  bookingsCollection,
  transactionsCollection,
} from '../../connections/mongodb.connection.js';
import { getLastSevenDays } from '../../utils/date.util.js';
import { format } from 'date-fns';

export default async function getDashboardStats(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const transactions = await transactionsCollection().find({ user_email: email }).toArray();
    const bookings = await bookingsCollection().find({ user_email: email }).toArray();

    const bookingStats = bookings.reduce(
      (prev, { status }) => {
        if (status in prev) prev[status]++;
        return prev;
      },
      {
        pending: 0,
        accepted: 0,
        rejected: 0,
        paid: 0,
      },
    );

    // get last seven days data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const lastSeventDaysTransactions = await transactionsCollection()
      .find({
        user_email: email,
        created_at: { $gte: sevenDaysAgo },
      })
      .toArray();

    const lastSevenDays = getLastSevenDays();
    const lastSevenDaysExpenseStats = lastSevenDays.map((d) => {
      const data = lastSeventDaysTransactions.find(
        ({ created_at }) => format(created_at, 'dd MMM') === d,
      );

      return {
        name: d,
        value: data ? data.amount : 0,
      };
    });

    res.send({
      total_bookings: bookings.length,
      booking_stat: bookingStats,
      total_transactions: transactions.length,
      last_seven_days_expense: lastSevenDaysExpenseStats.reduce((prev, t) => prev + t.value, 0),
      expense_stat: lastSevenDaysExpenseStats,
    });
  } catch (err) {
    console.error(err);
    res.send({ code: 'SERVER_ERROR', message: 'An unexpected internal server error occurred.' });
  }
}
