// External imports
import './loadEnv.js';
import express from 'express';
import cors from 'cors';

// Local imports
import indexRouter from './routes/indexRouter.js';
import { connectToMongoDB } from './connections/mongodb.connection.js';

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// App route
app.use(indexRouter);

// Initialize server
const PORT = process.env.PORT;
connectToMongoDB(() => {
  app.listen(PORT, () => {
    console.log('server started');
  });
});
