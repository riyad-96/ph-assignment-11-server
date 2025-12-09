import type { Request, Response } from 'express';
import { usersCollection } from '../../connections/mongodb.connection.js';
import { ObjectId } from 'mongodb';

export default async function updateRole(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;
    const { id, role } = req.body;
    const userColl = usersCollection();
    await userColl.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          role,
          updated_at: new Date(),
        },
      },
    );

    const updatedCurrentUser = await userColl.findOne({ email, role: 'admin' });
    res.send(updatedCurrentUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({ code: 'INTERNAL_SERVER_ERROR', message: 'Error while fetching data' });
  }
}
