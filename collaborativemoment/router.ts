import express from 'express';
import type {Request, Response} from 'express';

import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import CMCollection from './collection';
import * as cmValidator from './middleware';

const router = express.Router();

// TODO: should I enforce here that the user becomes an admin of the CM?
/**
 * Create a collaborative moment.
 *
 * @name POST /api/cm
 *
 * @return {CollaborativeMomentResponse} - The new collaborative moment
 * @throws {400} - If title is empty, description is too long, or somehow admin list is empty
 * @throws {403} - If user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    cmValidator.isValidCmDetails
  ],
  async (req: Request, res: Response) => {
    const cm = await CMCollection.addOne(req.body);
    res.status(200).json({
      message: 'Successfully created a collaborative moment.',
      collaborativeMoment: util.constructCMResponse(cm)
    });
  }
);

// Note: All fields will be replaced with what the client submits (i.e. via a form)
/**
 * Edit the details (not the entries) of a collaborative moment.
 * The currently logged in user must be an admin of the collaborative moment.
 *
 * @name PUT /api/cm/:cmId
 *
 * @param {string} cmId
 * @param {cmParameters}
 * @return {CollaborativeMomentResponse} - The updated collaborative moment
 * @throws {400} - If title is empty, description is too long, or somehow admin list is empty
 * @throws {403} - If user is not logged in or if user is not an editor or admin of the CM
 * @throws {404} - If CM ID is not valid
 */
router.put(
  '/:cmId',
  [
    userValidator.isUserLoggedIn,
    cmValidator.isCmExists,
    cmValidator.isCmEditorOrAdmin,
    cmValidator.isValidCmDetails
  ],
  async (req: Request, res: Response) => {
    console.log('req.body', req.body);
    const cm = await CMCollection.updateOne(req.params.cmId, req.body);
    res.status(200).json({
      message: 'Successfully updated a collaborative moment.',
      collaborativeMoment: util.constructCMResponse(cm)
    });
  }
);

/**
 * Add freets to a collaborative moment.
 * The currently logged in user must be an editor or admin of the collaborative moment.
 *
 * @name POST /api/cm/:cmId/entries
 *
 * @param {string} cmId - ID of collaborative moment to add freets to
 * @param {string[]} freets - In request body, list of IDs of freets to add
 * @throws {403} - If user is not logged in or if user is not an editor or admin of the CM
 * @throws {404} - If CM ID is not valid or any freet ID is not valid
 */
router.post(
  '/:cmId/entries',
  [
    userValidator.isUserLoggedIn,
    cmValidator.isCmEditorOrAdmin
    // TODO: validate that freets exist
  ],
  async (req: Request, res: Response) => {
    const cm = await CMCollection.updateOne(req.params.cmId, {freetsToAdd: req.body.freetsToAdd as string[]});
    res.status(200).json({
      message: 'Successfully added freets to collaborative moment.',
      collaborativeMoment: util.constructCMResponse(cm)
    });
  }
);

/**
 * Remove freets from a collaborative moment.
 * The currently logged in user must be an editor or admin of the collaborative moment.
 *
 * @name DELETE /api/cm/:cmId/entries
 *
 * @param {string} cmId - ID of collaborative moment to remove freets from
 * @param {string[]} freets - In request body, list of IDs of freets to remove
 * @throws {403} - If user is not logged in or if user is not an editor or admin of the CM
 */
router.delete(
  '/:cmId/entries',
  [
    userValidator.isUserLoggedIn,
    cmValidator.isCmEditorOrAdmin
  ],
  async (req: Request, res: Response) => {
    const cm = await CMCollection.updateOne(req.params.cmId, {freetsToRemove: req.body.freetsToRemove as string[]});
    res.status(200).json({
      message: 'Successfully removed freets from collaborative moment.',
      collaborativeMoment: util.constructCMResponse(cm)
    });
  }
);

/**
 * Delete a collaborative moment.
 * The currently logged in user must be an admin of the collaborative moment.
 *
 * @name DELETE /api/cm/:cmId
 *
 * @return {string} - Success message
 * @throws {403} - If user is not logged in or if user is not an admin of the CM
 * @throws {404} - If CM ID is not valid
 */
router.delete(
  '/:cmId',
  [
    userValidator.isUserLoggedIn,
    cmValidator.isCmExists,
    cmValidator.isCmAdmin
  ],
  async (req: Request, res: Response) => {
    await CMCollection.deleteOne(req.params.cmId);
    res.status(200).json({
      message: 'Successfully deleted a collaborative moment.'
    });
  }
);

export {router as cmRouter};
