import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;

// catchAsync returns a new anonymous function.
// This new function takes the usual req, res, and next parameters used in Express route handlers.
// Inside the returned function, fn(req, res, next) is called. This means the original route handler function fn is executed with the provided req, res, and next parameters.
// Promise.resolve is used to ensure that the result of fn(req, res, next) is treated as a Promise.
// .catch((err) => next(err)) adds error handling to this Promise. If fn throws an error or returns a rejected Promise. receive the error by err parameter and pass ther error at globalErrorHandler by next(err) function
