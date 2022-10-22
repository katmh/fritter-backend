import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

// TypeScript type definition for backend
// Represents object structure
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  followers: Types.ObjectId[];
  follows: Types.ObjectId[];
  posts: Types.ObjectId[];
  likes: Types.ObjectId[];
};

export type PopulatedUser = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  dateJoined: Date;
  followers: User[];
  follows: User[];
  posts: Freet[];
  likes: Freet[];
};

// A schema defines shape of MongoDB document
const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    required: true
  },
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  follows: [{type: Schema.Types.ObjectId, ref: 'User'}],
  posts: [{type: Schema.Types.ObjectId, ref: 'Freet'}],
  likes: [{type: Schema.Types.ObjectId, ref: 'Freet'}]
});

// A model is a constructor created from a schema
const UserModel = model<User>('User', UserSchema);
export default UserModel;
