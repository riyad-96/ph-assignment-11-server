import { Request, Response } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function advertiseTickets(req: Request, res: Response) {
  try {
    const { ticket_ids } = req.body;
    if (!Array.isArray(ticket_ids) || ticket_ids.length === 0) {
      return res.status(400).send({ code: 'INVALID_TICKET_IDS', message: 'Invalid ticket IDs' });
    }
    await ticketsCollection().updateMany(
      {},
      {
        $set: {
          isOnAd: false,
        },
      },
    );

    const result = await ticketsCollection().updateMany(
      { _id: { $in: ticket_ids.map((id) => new ObjectId(id)) } },
      {
        $set: {
          isOnAd: true,
        },
      },
    );
    res.status(200).send({
      code: 'TICKET_ADVERTISED',
      message: `${result.modifiedCount} tickets advertised successfully.`,
    });
  } catch (error) {
    console.error('Error advertising tickets:', error);
    res.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' });
  }
}
