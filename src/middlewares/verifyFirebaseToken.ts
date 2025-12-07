import admin from '../utils/firebaseAdmin.util.js';
import type { Request, Response, NextFunction } from 'express';

async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).send('unauthorized-access');

  const token = authorization.split(' ')[1];

  try {
    const tokenData = await admin.auth().verifyIdToken(token);
    res.locals.tokenData = tokenData;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send('unauthorized-access');
  }
}

export default verifyFirebaseToken;
