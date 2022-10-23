import type {Request, Response, NextFunction} from 'express';
import type {Types} from 'mongoose';
import UserModel from '../user/model';

const isNotAlreadyFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = (req.session.userId as string) ?? '';
  const {username: followeeUsername} = req.query;
  const follower = await UserModel.findById({_id: followerId});
  if (follower.follows.includes(followeeUsername as unknown as Types.ObjectId)) {
    res.status(400).json({
      error: 'Already following this user.'
    });
    return;
  }

  next();
};

export {
  isNotAlreadyFollowing
};
