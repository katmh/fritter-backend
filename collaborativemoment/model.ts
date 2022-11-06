import type {BasicPopulatedFreet} from 'freet/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type CollaborativeMoment = {
  _id: Types.ObjectId;
  title: string;
  // TODO: coverImage
  description: string;
  admins: Types.ObjectId[];
  editors: Types.ObjectId[];
  entries: Types.ObjectId[];
};

export type PopulatedCollaborativeMoment = {
  _id: Types.ObjectId;
  title: string;
  // TODO: coverImage
  description: string;
  admins: User[];
  editors: User[];
  entries: BasicPopulatedFreet[];
};

const CollaborativeMomentSchema = new Schema<CollaborativeMoment>({
  title: {
    type: String,
    required: true
  },
  // TODO: coverImage
  description: {
    type: String,
    required: true
  },
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  editors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  entries: [{
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true
  }]
});

const CollaborativeMomentModel = model<CollaborativeMoment>('CollaborativeMoment', CollaborativeMomentSchema);
export default CollaborativeMomentModel;
