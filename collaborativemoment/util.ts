import type {HydratedDocument} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';
import type {CollaborativeMoment} from './model';

type CMResponse = {
  _id: string;
  title: string;
  description: string;
  admins: any[];
  editors: any[];
  entries: any[];
};

const constructCMResponse = (cm: HydratedDocument<CollaborativeMoment>): CMResponse => ({
  _id: cm._id.toString(),
  title: cm.title,
  description: cm.description,
  admins: cm.admins,
  editors: cm.editors,
  entries: cm.entries
});

export {
  constructCMResponse
};
