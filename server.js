import express from "express";
import { APP_PORT } from './config';
import errorHandler from './middlewares/errorHandler'
const app = express();
import routes from './routes';
const connectDB = require('./config/db');
import path from 'path';


// Database connection 

connectDB();

global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api',routes)

app.use(errorHandler);
app.listen(APP_PORT ,() =>{
    console.log(`App is listening on port ${APP_PORT}`);
})