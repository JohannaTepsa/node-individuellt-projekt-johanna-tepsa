import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import menuRouter from './routes/menuRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import { initializeMenu } from './services/menuServices.js';

const app = express();
const PORT = 8080;
global.user = null;

app.use(cors());
app.use(express.json());

initializeMenu();

app.get('/', (req, res) => {
  res.send('Welcome to Airbean! We deliver coffee in a jiffy!');
});

app.use('/auth', authRouter);
app.use('/menu', menuRouter);
app.use('/cart', cartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});