import { Request, Response } from 'express';
import {
  bookingsCollection,
  transactionsCollection,
} from '../../connections/mongodb.connection.js';
import { getLastSevenDays } from '../../utils/date.util.js';
import { format } from 'date-fns';

export default async function getVendorDashboardStats(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;

    // last week stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const lastWeekTransactions = await transactionsCollection()
      .find({
        vendor_email: email,
        created_at: {
          $gte: sevenDaysAgo,
        },
      })
      .toArray();

    const lastSevenDays = getLastSevenDays();
    const lastWeekTransactionStats = lastSevenDays.map((d) => {
      const transactions = lastWeekTransactions.filter(
        (t) => format(t.created_at, 'dd-MMM-y') === d,
      );
      return {
        name: d.split(`-${format(new Date(), 'y')}`)[0],
        value: transactions.reduce((prev, { amount }) => prev + amount, 0),
      };
    });

    // bookings stats
    const bookings = await bookingsCollection().find({ vendor_email: email }).toArray();

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

    res.send({
      last_week_transactions: lastWeekTransactions.length,
      last_week_revenue: lastWeekTransactions.reduce((prev, { amount }) => prev + amount, 0),
      last_week_stats: lastWeekTransactionStats,
      total_bookings: bookings.length,
      booking_stats: bookingStats,
    });
  } catch (err) {
    console.error(err);
    res.send({ code: 'SERVER_ERROR', message: 'An unexpected internal server error occurred.' });
  }
}
