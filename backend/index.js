import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import router from './routes/validation.route.js';
import dbConnection from './dbConnection.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

// Establish database connection for ALL environments (local + Vercel)
dbConnection().catch((error) => {
  console.log('Database connection error:', error);
});

app.use('/validation', router);

app.get('/', (req, res) => res.json({message: "HELLO"}));

// Only start server in local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server started at port: ${port}`));
}

export default app;