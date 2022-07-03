import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './Routes/authRoutes.js';
import registerRoutes from './Routes/registersRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(registerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " + PORT));