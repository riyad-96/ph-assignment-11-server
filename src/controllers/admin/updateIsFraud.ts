import type { Request, Response } from 'express';
import { usersCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function updateIsFraud(req: Request, res: Response) {
  try {
    const { id, isFraud } = req.body;
    const userColl = usersCollection();
    await userColl.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          isFraud,
          updated_at: new Date(),
        },
      },
    );
    res.send({code: 'FRAUD_STATUS_UPDATED', message: 'Fraud status was updated'});
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while updating data' });
  }
}
