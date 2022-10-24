import type {HydratedDocument, Types} from 'mongoose';
import type {ReadingList} from './model';
import ReadingListModel from './model';

/**
 * Class with methods for interfacing with readinglists MongoDB collection
 *
 * Operations are closer to what API endpoints specifically require,
 * rather than being lower-level utilities like `updateOne`
 */
class ReadingListCollection {
  /**
   * Create a new empty reading list for a given user
   *
   * @param user ID of user who owns this reading list
   * @returns Newly created reading list
   */
  static async create(user: Types.ObjectId | string): Promise<HydratedDocument<ReadingList>> {
    const readingList = new ReadingListModel({
      user,
      entries: []
    });
    await readingList.save();
    return readingList;
  }

  /**
   * Add a single post (i.e. a freet) to a given user's reading list
   *
   * @param user ID of user whose reading list we want to add to
   * @param post ID of post to add to reading list
   * @returns Updated reading list
   */
  static async addPost(user: Types.ObjectId | string, post: Types.ObjectId | string): Promise<HydratedDocument<ReadingList>> {
    return ReadingListModel.findOneAndUpdate(
      {user},
      {$addToSet: {entries: post}},
      {new: true}
    );
  }

  /**
   * Delete a post from a user's reading list
   *
   * @param user ID of user who owns reading list
   * @param post ID of post to delete
   * @returns Updated reading list
   */
  static async removePost(user: Types.ObjectId | string, post: Types.ObjectId | string): Promise<HydratedDocument<ReadingList>> {
    return ReadingListModel.findOneAndUpdate(
      {user},
      {$pull: {entries: post}},
      {new: true}
    );
  }
}

export default ReadingListCollection;
