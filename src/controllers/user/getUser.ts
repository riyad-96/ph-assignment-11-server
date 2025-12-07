import type { Request, Response } from 'express';
import { usersCollection } from '../../connections/mongodb.connection.js';

async function getUser(req: Request, res: Response) {
  try {
    const { email } = res.locals.tokenData;

    const usersColl = usersCollection();
    const user = await usersColl.findOne({ email });
    if (!user)
      return res.status(404).send({
        code: 'USER_NOT_FOUND',
        message: 'The user record associated with the authenticated account could not be found.',
      });

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    });
  }
}

export { getUser };
