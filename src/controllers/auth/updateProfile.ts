import admin from '../../utils/firebaseAdmin.util.js';
import type { Request, Response } from 'express';
import type { UpdateInfo } from './types.d.js';
import { usersCollection } from '../../connections/mongodb.connection.js';

async function updateProfile(req: Request, res: Response) {
  try {
    const { email, uid } = res.locals.tokenData;
    const data: UpdateInfo = req.body;

    await admin.auth().updateUser(uid, {
      displayName: data?.name,
      photoURL: data?.photoURL,
    });

    const userColl = usersCollection();
    const updatedUserData = await userColl.findOneAndUpdate(
      { email },
      {
        $set: {
          name: data?.name,
          photoURL: data?.photoURL,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    res.send(updatedUserData);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 'PROFILE_UPDATE_FAILED',
      message: 'Error while updating profile informations.',
    });
  }
}

export default updateProfile;
