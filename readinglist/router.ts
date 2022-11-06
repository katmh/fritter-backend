import express from 'express';
import type {Request, Response} from 'express';

import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Add freet with given ID to reading list of currently logged in user. Idempotent.
 *
 * @name POST /api/readinglist/:id
 *
 * @return {ReadingListResponse} - The user's updated reading list
 * @throws {403} - If user is not logged in
 * @throws {404} - If freetId is not valid
 */
router.post(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    const userId = req.session.userId as string;
    const user = await UserCollection.addReadingListEntry(userId, freetId);
    res.status(200).json({
      message: 'Successfully added freet to reading list.',
      readingList: util.constructReadingListResponse(user)
    });
  }
);

/**
 * Remove freet with given ID from reading list of currently logged in user. Idempotent.
 *
 * @name DELETE /api/readinglist/:id
 *
 * @return {ReadingListResponse} - The user's updated reading list
 * @throws {403} - If user is not logged in
 * @throws {404} - If freetId is not valid
 */
router.delete(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    const userId = req.session.userId as string;
    const user = await UserCollection.removeReadingListEntry(userId, freetId);
    res.status(200).json({
      message: 'Successfully removed freet from reading list.',
      readingList: util.constructReadingListResponse(user)
    });
  }
);

/**
 * Remove all freets from reading list of currently logged in user. Idempotent.
 *
 * @name DELETE /api/readinglist/
 *
 * @return {ReadingListResponse} - The user's updated reading list
 * @throws {403} - If user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    console.log(`clearing reading list of user ${userId}`);
    const user = await UserCollection.clearReadingList(userId);
    res.status(200).json({
      message: 'Successfully cleared reading list.',
      readingList: util.constructReadingListResponse(user)
    });
  }
);

export {router as readingListRouter};
