class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string, stack = '') {
    super(message); //This calls the constructor of the parent Error class with the message parameter. This initializes the message property of the Error class.
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack; // If a stack trace is provided, set it to this.stack
    } else {
      Error.captureStackTrace(this, this.constructor);
      //this.constructor use kora hoy specific vabe constructor er moddhe error trace er jonno
      // If no stack trace is provided, capture the current stack trace and associate it with this.constructor
    }
  }
}

export default AppError;
