import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import FreetCollection from './collection';

type FreetResponse = {
  _id: string;
  author: string;
  timePosted: string;
  textContent: string;
  isReplyTo?: FreetResponse;
  replies: Array<Freet | PopulatedFreet>; // TODO
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
const constructFreetResponse = async (freet: HydratedDocument<Freet> | HydratedDocument<PopulatedFreet>): Promise<FreetResponse> => {
  // Make a copy without the __v property
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({versionKey: false})
  };

  // We will return username of author
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;

  // If this freet is a reply, we will recursively construct an API response object
  // representing the freet that this freet replies to
  const previousTweet = freetCopy.isReplyTo ? await FreetCollection.findOne(freetCopy.isReplyTo._id) : undefined;

  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    timePosted: formatDate(freet.timePosted),
    isReplyTo: previousTweet ? await constructFreetResponse(previousTweet) : undefined
  };
};

export {
  constructFreetResponse
};
