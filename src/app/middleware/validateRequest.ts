import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utills/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};

export default validateRequest;

// validateRequest is a higher-order function that takes a schema as an argument.
// The schema parameter is expected to be of type AnyZodObject, which represents any Zod schema object. This will be used to validate the incoming request data.
// Inside the middleware, schema.parseAsync is called to validate the request body (req.body) against the provided Zod schema.
// parseAsync is used to ensure the validation is asynchronous and can handle potential asynchronous operations within the schema.
