import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundRoute from './app/middleware/notFoundRoute';
import router from './app/routes';
const app: Application = express();

//parser
app.use(express.json());
app.use(cors());

//application routes
app.use('/api/v1/', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello there');
});

//global error handler
app.use(globalErrorHandler);

//no route
app.use(notFoundRoute);

export default app;
