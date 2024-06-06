class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
      //this.constructor use kora hoy specific vabe constructor er moddhe error trace er jonno
    }
  }
}

export default AppError;
