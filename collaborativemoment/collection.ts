import type {HydratedDocument, Types} from 'mongoose';
import CollaborativeMomentModel from './model';
import type {CollaborativeMoment} from './model';
import UserCollection from '../user/collection';

export type cmParameters = {
  title?: string;
  description?: string;
  admins?: string[];
  editors?: string[];
};

type cmParametersWithFreets = cmParameters & {
  freetsToAdd?: Array<string | Types.ObjectId>;
  freetsToRemove?: Array<string | Types.ObjectId>;
};

const usernamesToIds = async (usernames: string[]): Promise<Types.ObjectId[]> => Promise.all(usernames.map(
  async (username: string) => (await UserCollection.findOneByUsername(username))?._id
));

/**
 * Class with methods for interfacing with the `collaborativemoments` MongoDB collection
 */
class CMCollection {
  /**
   * Create a new collaborative moment.
   */
  static async addOne(cmDetails: cmParameters): Promise<HydratedDocument<CollaborativeMoment>> {
    const {title, description} = cmDetails;
    const {admins: adminUsernames, editors: editorUsernames} = cmDetails;
    const admins = await usernamesToIds(adminUsernames);
    const editors = await usernamesToIds(editorUsernames);
    const cm = new CollaborativeMomentModel({title, description, admins, editors, entries: []});
    await cm.save();
    return cm;
  }

  /**
   * Find a collaborative moment by ID.
   */
  static async findOne(cmId: string | Types.ObjectId): Promise<HydratedDocument<CollaborativeMoment>> {
    return CollaborativeMomentModel.findOne({_id: cmId});
  }

  // TODO: enforce unique members of admins and editors
  /**
   * Update a collaborative moment.
   *
   * @param {string} cmId - ID of collaborative moment to update
   * @param {cmParametersWithFreets} cmDetails
   */
  static async updateOne(cmId: string, cmDetails: cmParametersWithFreets): Promise<HydratedDocument<CollaborativeMoment>> {
    const {title, description, admins: adminUsernames, editors: editorUsernames, freetsToAdd, freetsToRemove} = cmDetails;
    const admins = adminUsernames ? await usernamesToIds(adminUsernames) : adminUsernames;
    const editors = editorUsernames ? await usernamesToIds(editorUsernames) : editorUsernames;
    return CollaborativeMomentModel.findOneAndUpdate({_id: cmId}, {
      ...(title ? {title} : null),
      ...(description ? {description} : null),
      ...(admins ? {admins} : null),
      ...(editors ? {editors} : null),
      ...(freetsToAdd ? {$addToSet: {entries: {$each: freetsToAdd}}} : null),
      ...(freetsToRemove ? {$pullAll: {entries: freetsToRemove}} : null)
    }, {new: true});
  }

  /**
   * Delete the collaborative moment with the given ID.
   *
   * @param {string} cmId - ID of collaborative moment to delete
   * @return {Promise<Boolean>} - true if the collaborative moment has been deleted, false otherwise
   */
  static async deleteOne(cmId: Types.ObjectId | string): Promise<boolean> {
    const cm = await CollaborativeMomentModel.deleteOne({_id: cmId});
    return cm !== null;
  }
}

export default CMCollection;
