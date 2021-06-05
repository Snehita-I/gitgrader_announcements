import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import assignmentsRouter from './routes/assignments.js';
import usersRouter from './routes/users.js';
import classesRouter from './routes/classes.js';
import announcementRouter from './routes/announcements.js'
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true ,rejectUnauthorized:false, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.use('/assignments', assignmentsRouter);
app.use('/users', usersRouter);
app.use('/classes',classesRouter);
app.use('/announcements',announcementRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
