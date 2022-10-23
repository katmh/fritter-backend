// Follow is not treated as a full-fledged concept in my Fritter app.
// However, I wanted any RESTful API routes for following to be at /api/follow
// rather than /api/user, so this is a small router to do that.
// It largely uses types, methods, etc from the User concept implementation.

import express from 'express';
import type {Request, Response} from 'express';
import * as userValidator from '../user/middleware';
import UserCollection from '../user/collection';
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
    const followerId = (req.session.userId as string) ?? ''; // Will not be empty, due to isUserLoggedIn
    const {username: followeeUsername} = req.query;
    const updatedFollower = await UserCollection.follow(followerId, followeeUsername as string);
    res.status(200).json({
      message: 'Follow was successful.',
      follower: util.constructUserResponse(updatedFollower)
    });
  }
);

export {router as followRouter};
