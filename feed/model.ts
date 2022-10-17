import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

export type Feed = {
  _id: Types.ObjectId;
  entries: Types.ObjectId[];
};

export type PopulatedFeed = {
  _id: Types.ObjectId;
  entries: Freet[];
};

const FeedSchema = new Schema<Feed>({
  entries: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const FeedModel = model<Feed>('Feed', FeedSchema);
export default FeedModel;
