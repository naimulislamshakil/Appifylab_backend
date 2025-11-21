import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbConnect } from './database/dbConnect.js';

export const app = express();
config({ path: './config.env' });
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// databse
dbConnect();



