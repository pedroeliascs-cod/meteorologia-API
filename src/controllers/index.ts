import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: unknown
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(422).send({ code: 422, error: (error as Error).message });
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong!' });
    }
  }
}
