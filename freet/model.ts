import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {CollaborativeMoment} from '../collaborativemoment/model';

export type Freet = {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  timePosted: Date;
  textContent: string;
  isDeleted: boolean;
  likes: Types.ObjectId[];
  replies: Types.ObjectId[];
  retweets: Types.ObjectId[];
  isStartOfThread: boolean;

  // Make isReplyTo a field because otherwise we'd have to check all tweets
  // to see if a given tweet is a reply to another tweet
  isReplyTo?: Types.ObjectId; // TODO: Should this be required?
  // Make isRetweetOf a field for the same reason as isReplyTo
  isRetweetOf?: Types.ObjectId;
  startOfThread?: Types.ObjectId;
  mentions?: Types.ObjectId;
};

// TODO: These types are drafts, subject to change
// Minimally populated, intended for displaying individual tweet on feed
export type BasicPopulatedFreet = {
  _id: Types.ObjectId;
  author: User;
  timePosted: Date;
  textContent: string;
  isDeleted: boolean;
  likes: User[];
  replies: Types.ObjectId[];
  retweets: Types.ObjectId[];
  isStartOfThread: boolean;

  isReplyTo?: Types.ObjectId;
  isRetweetOf?: BasicPopulatedFreet;
  startOfThread?: BasicPopulatedFreet;
  mentions: CollaborativeMoment;
};

// More populated, intended for page focused on this individual freet
export type FocusedPopulatedFreet = {
  _id: Types.ObjectId;
  author: User;
  timePosted: Date;
  textContent: string;
  isDeleted: boolean;
  likes: User[];
  replies: BasicPopulatedFreet[];
  retweets: Types.ObjectId[];
  isStartOfThread: boolean;

  isReplyTo?: BasicPopulatedFreet;
  isRetweetOf?: BasicPopulatedFreet;
  startOfThread?: BasicPopulatedFreet;
  mentions: CollaborativeMoment;
};

const FreetSchema = new Schema<Freet>({
  // Attribute tells mongoose what model to use during population
  author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  timePosted: {type: Date, required: true},
  textContent: {type: String, required: true},
  isDeleted: {type: Boolean, required: true},

  isReplyTo: {type: Schema.Types.ObjectId, ref: 'Freet'},
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true
  }],

  isRetweetOf: {type: Schema.Types.ObjectId, ref: 'Freet'},
  retweets: [{
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true
  }],

  isStartOfThread: {type: Boolean, required: true},
  startOfThread: {type: Schema.Types.ObjectId, ref: 'Freet'},

  // mentioned: {type: Schema.Types.ObjectId, ref: ''} // TODO: what ref?
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
