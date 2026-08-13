import path from 'path';
import express from 'express';
import 'dotenv/config';
import colors from 'colors';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import { notFound, errorHandler } from './middlewares/error';
import db from './config/db';
import authRoute from './routers/auth.router';
import userRoute from './routers/user.router';
import profileRoute from './routers/profile.router';
import uploadRoute from './routers/upload.router';

db();

const app = express();
app.use(cors());
app.use(fileUpload());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api', uploadRoute);
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', profileRoute);

app.use('/api/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      status: `Server running ${process.env.NODE_ENV} mode on port ${PORT}`,
    });
  });
}

app.use(notFound);

app.use(errorHandler);

app.listen(
  PORT, () =>
  console.log(colors.yellow.bold(`Server running ${process.env.NODE_ENV} mode on port ${PORT}`))
);
