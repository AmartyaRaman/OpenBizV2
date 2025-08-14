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

app.use('/validation', router);

app.get('/', (req, res) => res.send({message: "HELLO"}));

dbConnection().then(() => {
  app.listen(port, () => console.log(`Server started at port: ${port}`))
}).catch((error) => {
  console.log(error);
})