import { NextFunction, Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../services/user.service';

export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    // logger.error(e);
    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already exist',
      });
    }
    next(err);
  }
}
