import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Profile = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  displayName: string;
  // TODO: avatar
  bio: string;
  location: string;
  profileColor: string;
};

export type PopulatedProfile = {
  _id: Types.ObjectId;
  user: User;
  displayName: string;
  // TODO: avatar
  bio: string;
  location: string;
  profileColor: string;
};

const ProfileSchema = new Schema<Profile>({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  // TODO: avatar
  bio: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  profileColor: {
    type: String,
    required: true
  }
});

const ProfileModel = model<Profile>('Profile', ProfileSchema);
export default ProfileModel;
