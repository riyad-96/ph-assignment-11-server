import type { Request, Response } from 'express';
import { ticketsCollection, bookingsCollection } from '../../connections/mongodb.connection.js';
import { KPIDataArray, KPIDataRaw } from './types.d.js';


export default async function getRevenueOverview(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;

    // tickets
    const tickets = await ticketsCollection().find({ vendor_email: email }).toArray();
    const totalTicketsCount = tickets.reduce((prev, ticket) => prev + ticket.quantity, 0);
    const totalTicketPrice = tickets.reduce(
      (prev, ticket) => prev + ticket.price * ticket.quantity,
      0,
    );

    // bookings
    const bookings = await bookingsCollection().find({ vendor_email: email }).toArray();
    const paidBookings = bookings.filter((booking) => booking.status === 'paid');
    const totalPaidTicketsCount = paidBookings.reduce(
      (prev, booking) => prev + booking.quantity,
      0,
    );
    const totalSell = paidBookings.reduce((prev, booking) => {
      const ticketPrice = tickets.find(
        (t) => t._id.toString() === booking.ticket_id.toString(),
      )?.price;
      return prev + booking.quantity * (ticketPrice as number);
    }, 0);

    const sales_percentage = parseFloat(
      ((totalPaidTicketsCount / totalTicketsCount) * 100).toFixed(2),
    );
    const average_ticket_price = parseFloat((totalTicketPrice / totalTicketsCount).toFixed(2));

    const kpi_data_raw: KPIDataRaw = {
      total_tickets: totalTicketsCount,
      total_sold_tickets: totalPaidTicketsCount,
      unsold_tickets: totalTicketsCount - totalPaidTicketsCount,
      total_sell: totalSell,
      sales_percentage: sales_percentage || 0,
      average_ticket_price: average_ticket_price || 0,
    };

    const kpi_data: KPIDataArray[] = [
      { label: 'Total sales', value: kpi_data_raw.total_sell },
      { label: 'Total tickets', value: kpi_data_raw.total_tickets },
      { label: 'Total sold tickets', value: kpi_data_raw.total_sold_tickets },
      { label: 'Unsold tickets', value: kpi_data_raw.unsold_tickets },
      { label: 'Sales percentage', value: kpi_data_raw.sales_percentage },
      { label: 'Average ticket price', value: kpi_data_raw.average_ticket_price },
    ];

    res.send({ kpi_data_raw, kpi_data });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    });
  }
}
