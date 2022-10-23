import express from 'express';
import type {Request, Response} from 'express';

import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as util from '../user/util';

const router = express.Router();

/**
 * Have the user who is currently logged in (denoted the follower)
 * follow another user (the followee).
 *
 * @name POST /api/follow?username=username
 *
 * @return {UserResponse[]} - The updated follower user
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const followerId = req.session.userId as string;
    const followeeUsername = req.query.username as string;
    const {follower, followee} = await UserCollection.follow(followerId, followeeUsername);
    res.status(200).json({
      message: 'Follow was successful.',
      follower: util.constructUserResponse(follower),
      followee: util.constructUserResponse(followee)
    });
  }
);

export {router as followRouter};
