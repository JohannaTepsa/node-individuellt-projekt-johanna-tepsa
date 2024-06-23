import express from 'express';
import cors from 'cors';
import session from 'express-session';
import userRouter from './routes/users.js';
import orderRouter from './routes/orders.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import aboutRouter from './routes/about.js';
import adminRouter from './routes/admins.js';
import campaignRoutes from './routes/campaigns.js';

const app = express();
const PORT = 8000;
global.use = null;
global.admin = null;

app.use(express.json());
app.use(cors());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/orders', orderRouter);
app.use('/menu', menuRouter);
app.use('/cart', cartRouter);
app.use('/about', aboutRouter);
app.use('/campaign', campaignRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Airbean! We deliver coffee in a jiffy!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});