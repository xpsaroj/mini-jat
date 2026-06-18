import type { Request, Response, NextFunction, RequestHandler } from 'express';
import * as service from './applications.service.js';
import type { ApplicationSelect } from '../../db/schema.js';
import type { CreateApplicationInput, UpdateApplicationInput } from './applications.validator.js';
import { ApiError } from '../../middleware/errorHandler.js';


// Local async wrapper
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}


// Helper to parse a numeric route param safely
function parseId(req: Request): number {
  const rawParam = req.params['id'];
  const raw = Array.isArray(rawParam) ? rawParam[0] : rawParam;
  if (raw === undefined) throw new ApiError('Missing id parameter', 400);
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) throw new ApiError('Invalid id parameter', 400);
  return id;
}


// GET /api/applications
export const getAll = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // After validate(querySchema, 'query'), values are already coerced
    const q = req.query as {
      status?: ApplicationSelect['status'];
      search?: string;
      page?: number;
      limit?: number;
    };

    const result = await service.getAllApplications({
      status: q.status,
      search: q.search,
      page: q.page,
      limit: q.limit,
    });

    res.json(result);
  },
);


// GET /api/applications/:id
export const getById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req);
    const application = await service.getApplicationById(id);
    res.json({ data: application });
  },
);


// POST /api/applications
export const create = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateApplicationInput;
    const application = await service.createApplication(body);
    res.status(201).json({ data: application });
  },
);


// PATCH /api/applications/:id
export const update = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req);
    const body = req.body as UpdateApplicationInput;
    const application = await service.updateApplication(id, body);
    res.json({ data: application });
  },
);


// DELETE /api/applications/:id
export const remove = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req);
    const result = await service.deleteApplication(id);
    res.json(result);
  },
);
