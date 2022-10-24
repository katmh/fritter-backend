import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Freet = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  timePosted: Date;
  textContent: string;
};

export type PopulatedFreet = {
  _id: Types.ObjectId;
  authorId: User;
  timePosted: Date;
  textContent: string;
};

const FreetSchema = new Schema<Freet>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  timePosted: {
    type: Date,
    required: true
  },
  textContent: {
    type: String,
    required: true
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
