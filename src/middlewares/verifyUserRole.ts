import type { Request, Response, NextFunction } from 'express';

type AllowedRoles = 'user' | 'vendor' | 'admin';

export default function verifyUserRole(role: AllowedRoles) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tokenData = res.locals.tokenData;
    if (role === tokenData.role) {
      next();
    } else {
      res.status(403).send({
        code: 'FORBIDDEN',
        message: 'Requires administrator privileges.',
      });
    }
  };
}
