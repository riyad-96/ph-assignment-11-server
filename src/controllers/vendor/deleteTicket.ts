import { Response, Request } from 'express';
import { ticketsCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function deleteTicket(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const ticketId = req.params.ticketId;
    const ticketObjectId = new ObjectId(ticketId);

    const ticketToDelete = await ticketsCollection().findOne({
      vendor_email: email,
      _id: ticketObjectId,
    });
    if (!ticketToDelete) {
      return res.status(404).send({
        code: 'TICKET_NOT_FOUND',
        message: 'Ticket not found or you do not have permission to delete it.',
      });
    }
    await ticketsCollection().deleteOne({
      _id: ticketObjectId,
    });
    res.status(200).send({ message: 'Ticket deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while deleting the ticket.',
    });
  }
}
