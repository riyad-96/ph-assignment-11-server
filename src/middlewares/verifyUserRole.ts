import type { Request, Response, NextFunction } from 'express';
import { usersCollection } from '../connections/mongodb.connection.js';

type AllowedRoles = 'user' | 'vendor' | 'admin';

export default function verifyUserRole(role: AllowedRoles) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { email } = res.locals.tokenData;
    
    const userColl = usersCollection();
    const user = await userColl.findOne({ email });

    if (user?.role === role) {
      next();
    } else {
      res.status(403).send({
        code: 'FORBIDDEN',
        message: 'Requires administrator privileges.',
      });
    }
  };
}
