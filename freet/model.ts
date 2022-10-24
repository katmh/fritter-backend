import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Freet = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  timePosted: Date;
  textContent: string;
  isReplyTo: Types.ObjectId | undefined;
  replies: Types.ObjectId[];
};

export type PopulatedFreet = {
  _id: Types.ObjectId;
  authorId: User;
  timePosted: Date;
  textContent: string;
  isReplyTo: Freet | PopulatedFreet;
  // Allowing `Freet`s in the array makes it so we're not forced to populate all levels of nesting
  replies: Array<Freet | PopulatedFreet>;
};

// Require all properties as a convention
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
  },
  isReplyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true
  }]
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
