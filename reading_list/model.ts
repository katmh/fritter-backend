import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

import type {User} from '../user/model';
import type {Freet} from '../freet/model';

export type ReadingList = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  entries: Types.ObjectId[];
};

export type PopulatedReadingList = {
  _id: Types.ObjectId;
  user: User;
  entries: Freet[]; // TODO: maybe PopulatedFreet
};

const ReadingListSchema = new Schema<ReadingList>({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  entries: [{type: Schema.Types.ObjectId, ref: 'Freet'}]
});

const ReadingListModel = model<ReadingList>('ReadingList', ReadingListSchema);
export default ReadingListModel;
