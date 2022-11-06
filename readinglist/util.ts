import type {HydratedDocument} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';

type ReadingListResponse = any[];

const constructReadingListResponse = (user: HydratedDocument<User>): ReadingListResponse => (
  user.readingList as ReadingListResponse
);

export {
  constructReadingListResponse
};
