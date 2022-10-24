import mongoose from 'mongoose';
import type {HydratedDocument, Types} from 'mongoose';

import UserCollection from '../user/collection';

import type {Freet} from './model';
import FreetModel from './model';

const FIELDS_TO_POPULATE = ['authorId', 'isReplyTo', 'isRetweetOf'];

/**
 * Class with methods for interfacing with the `freet` MongoDB collection.
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} textContent - The text content of the tweet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, textContent: string, replyToId: string | undefined, retweetOfId: string | undefined): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      timePosted: date,
      textContent,
      replies: [],
      retweets: []
    });

    if (replyToId) {
      // If no replyToId argument is provided, then the created freet won't have the isReplyTo field set
      const previousTweetId = new mongoose.Types.ObjectId(replyToId);
      freet.isReplyTo = previousTweetId;
      // Add newly created tweet to the replies array of previous tweet
      await FreetModel.findOneAndUpdate(
        {_id: previousTweetId},
        {$addToSet: {replies: freet._id}}
      );
    }

    if (retweetOfId) {
      const originalTweetId = new mongoose.Types.ObjectId(retweetOfId);
      freet.isRetweetOf = originalTweetId;

      // TODO: enforce that user can only retweet a tweet once
      await FreetModel.findOneAndUpdate(
        {_id: originalTweetId},
        {$addToSet: {retweets: freet._id}}
      );
    }

    await freet.save();
    return freet.populate(FIELDS_TO_POPULATE);
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate(FIELDS_TO_POPULATE);
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate(FIELDS_TO_POPULATE);
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).populate(FIELDS_TO_POPULATE);
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;
