import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CMCollection from './collection';

/**
 * Check if the details of the collaborative moment are valid, i.e. title
 * is not empty and description is no more than 280 characters.
 */
const isValidCmDetails = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    res.status(400).json({
      error: 'Collaborative moment must have a title.'
    });
    return;
  }

  if (req.body.description.length > 280) {
    res.status(400).json({
      error: 'Collaborative moment description must be no more than 280 characters.'
    });
    return;
  }

  if (!req.body.admins.length) {
    res.status(400).json({
      error: 'Collaborative moment must have at least one admin.'
    });
    return;
  }

  next();
};

/**
 * Check if a collaborative moment with the ID `req.params.cmId` exists.
 */
const isCmExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.cmId);
  if (!validFormat) {
    res.status(400).json({
      error: 'Invalid collaborative moment ID.'
    });
    return;
  }

  const cm = await CMCollection.findOne(req.params.cmId);
  if (!cm) {
    res.status(404).json({
      error: `Collaborative moment with ID ${req.params.cmId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Check if the currently logged in user is either an editor or
 * admin of the CM with id `req.params.cmId`. Assumes that `req.params.cmId`
 * exists and is a valid CM ID.
 */
const isCmEditorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const cm = await CMCollection.findOne(req.params.cmId);
  if (!cm.editors.includes(req.session.userId) && !cm.admins.includes(req.session.userId)) {
    res.status(403).json({
      error: 'You must be an editor or admin of this CM to perform this action.'
    });
  }

  next();
};

/**
 * Check if the currently logged in user is an admin of the CM with id `req.params.cmId`.
 * Assumes that `req.params.cmId` exists and is a valid CM ID.
 */
const isCmAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const cm = await CMCollection.findOne(req.params.cmId);
  if (!cm.admins.includes(req.session.userId)) {
    res.status(403).json({
      error: 'You must be an admin of this CM to perform this action.'
    });
  }

  next();
};

export {
  isValidCmDetails,
  isCmExists,
  isCmEditorOrAdmin,
  isCmAdmin
};
