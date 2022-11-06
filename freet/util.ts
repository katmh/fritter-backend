import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, BasicPopulatedFreet} from '../freet/model';
import FreetCollection from './collection';
import type {Types} from 'mongoose';

type FreetResponse = {
  _id: string;
  author: string;
  timePosted: string;
  textContent: string;
  isReplyTo?: string | FreetResponse;
  replies: Types.ObjectId[]; // TODO
  isRetweetOf?: string | FreetResponse;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = async (freet: HydratedDocument<Freet> | HydratedDocument<BasicPopulatedFreet>): Promise<FreetResponse> => {
  const freetResponseHelper = async (freet: HydratedDocument<Freet> | HydratedDocument<BasicPopulatedFreet>, isRecursiveCall: boolean): Promise<FreetResponse> => {
    // Make a copy without the __v property
    const freetCopy: BasicPopulatedFreet = {
      ...freet.toObject({versionKey: false})
    };

    // We will return username of author
    const {username} = freetCopy.author;
    delete freetCopy.author;

    // If this freet is a reply, we will recursively construct an API response object
    // representing the freet that this freet replies to. Only one level of recursion.
    // Same goes for retweet.
    const previousTweet = freetCopy.isReplyTo ? await FreetCollection.findOne(freetCopy.isReplyTo._id) : undefined;
    const originalTweet = freetCopy.isRetweetOf ? await FreetCollection.findOne(freetCopy.isRetweetOf._id) : undefined;

    return {
      ...freetCopy,
      _id: freetCopy._id.toString(),
      author: username,
      timePosted: formatDate(freet.timePosted),
      isReplyTo: previousTweet
        ? (isRecursiveCall ? previousTweet._id.toString() : await freetResponseHelper(previousTweet, true))
        : undefined,
      isRetweetOf: originalTweet
        ? (isRecursiveCall ? originalTweet._id.toString() : await freetResponseHelper(originalTweet, true))
        : undefined
    };
  };

  return freetResponseHelper(freet, false);
};

export {
  constructFreetResponse
};
