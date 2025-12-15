import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import getFraudFilteredTickets from '../../utils/filterFraudTickets.js';

export default async function getPublicTickets(req: Request, res: Response) {
  try {
    const approvedTickets = await ticketsCollection()
      .find({ status: 'approved' })
      .sort({ created_at: -1 })
      .toArray();

    const fraudFilteredTickets = await getFraudFilteredTickets(approvedTickets);
    console.log(fraudFilteredTickets)

    const finalData = {
      advertised: fraudFilteredTickets.filter((t) => t.isOnAd),
      regular: fraudFilteredTickets.slice(0, 9),
    };

    res.send(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 'SERVER_ERROR', message: 'Server Error' });
  }
}
