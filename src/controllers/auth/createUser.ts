import type { Request, Response } from 'express';
import { NewUser, User } from './types.js';
import { usersCollection } from '../../connections/mongodb.connection.js';
import admin from '../../utils/firebaseAdmin.util.js';
import { FirebaseError } from 'firebase-admin';

export default async function createUser(req: Request, res: Response) {
  try {
    const data: NewUser = req.body;
    // Check if required data is available
    if (!data.email || !data.password || !data.name || !data.photoURL) {
      return res.status(400).send({
        code: 'MISSING_FIELDS',
        message: 'The email, password, name and photoURL fields are required.',
      });
    }
    // Create new user
    let userRecord = null;
    try {
      userRecord = await admin.auth().createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
        photoURL: data.photoURL,
      });
    } catch (err) {
      const error = err as FirebaseError;
      if (error.code === 'auth/email-already-exists') {
        return res.status(409).send({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'A user with this email already exists.',
        });
      }
      return res.status(500).send({
        code: 'SERVER_ERROR',
        message: 'An unexpected internal server error occurred.',
      });
    }

    const usersColl = usersCollection();
    const role = 'user';

    const newUserData: Omit<User, '_id'> = {
      uid: userRecord.uid as string,
      email: userRecord.email as string,
      name: userRecord.displayName as string,
      photoURL: userRecord.photoURL as string,
      role,
      isFraud: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await usersColl.insertOne(newUserData);
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).send({
      code: 'USER_CREATED',
      message: 'User was successfully created',
      customToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    });
  }
}
