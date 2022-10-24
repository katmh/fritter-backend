import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Freet = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  timePosted: Date;
  textContent: string;

  isReplyTo?: Types.ObjectId;
  replies: Types.ObjectId[];

  isRetweetOf?: Types.ObjectId;
  retweets: Types.ObjectId[];

  isStartOfThread: boolean;
  startOfThread?: Types.ObjectId;
};

// TODO: might make only partly populated
export type PopulatedFreet = {
  _id: Types.ObjectId;
  authorId: User;
  timePosted: Date;
  textContent: string;

  isReplyTo?: Freet | PopulatedFreet; // TODO: might be Freet only
  // Allowing `Freet`s in the array makes it so we're not forced to populate all levels of nesting
  replies: Array<Freet | PopulatedFreet>;

  isRetweetOf?: Types.ObjectId;
  retweets: Array<Freet | PopulatedFreet>;

  isStartOfThread: boolean;
  startOfThread?: Freet | PopulatedFreet;
};

const FreetSchema = new Schema<Freet>({
  // Attribute tells mongoose what model to use during population
  authorId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  timePosted: {type: Date, required: true},
  textContent: {type: String, required: true},

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
  startOfThread: {type: Schema.Types.ObjectId, ref: 'Freet'}
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
