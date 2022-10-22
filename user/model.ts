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
  followers: Set<User>;
  follows: Set<User>;
  posts: Set<Freet>;
  likes: Set<Freet>;
};

// A schema defines shape of MongoDB document
const UserSchema = new Schema({
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
