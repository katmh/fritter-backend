import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {User} from './model';

type UserResponse = {
  _id: string;
  username: string;
  dateJoined: string;
  followers: string[];
  follows: string[];
  // TODO: add other fields
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw User object from the database into an object
 * for use by the frontend. In particular, remove the password for security purposes.
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: User = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    dateJoined: formatDate(user.dateJoined),
    followers: userCopy.followers.map(follower => String(follower)),
    follows: userCopy.follows.map(follow => String(follow))
  };
};

export {
  constructUserResponse
};
