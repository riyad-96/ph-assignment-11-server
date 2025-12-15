import type { Request, Response } from 'express';
import { usersCollection } from '../../connections/mongodb.connection.js';
import admin from '../../utils/firebaseAdmin.util.js';
import { User } from './types.js';

export default async function socialLogin(req: Request, res: Response) {
  try {
    const { uid, email } = res.locals.tokenData;
    const userColl = usersCollection();

    const user = await userColl.findOne({ email });
    if (user) return res.send(user);

    const role = 'user';

    const firebaseUser = await admin.auth().getUser(uid);
    const newUserData: Omit<User, '_id'> = {
      uid,
      email,
      name: firebaseUser.displayName as string,
      photoURL: firebaseUser.photoURL as string,
      role,
      isFraud: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await userColl.insertOne(newUserData);
    const createdUser = await userColl.findOne({ email });

    res.status(201).send(createdUser);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    });
  }
}
