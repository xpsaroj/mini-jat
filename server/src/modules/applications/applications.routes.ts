import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
  querySchema,
} from './applications.validator.js';
import * as controllers from './applications.controller.js';

export const router = Router();

// GET  /api/applications          — list with filters, search, pagination
router.get('/', validate(querySchema, 'query'), controllers.getAll);

// GET  /api/applications/:id      — single application
router.get('/:id', controllers.getById);

// POST /api/applications          — create
router.post('/', validate(createApplicationSchema), controllers.create);

// PATCH /api/applications/:id     — partial update
router.patch('/:id', validate(updateApplicationSchema), controllers.update);

// DELETE /api/applications/:id    — delete
router.delete('/:id', controllers.remove);
