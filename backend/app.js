const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const dotenv = require('dotenv');

const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');

dotenv.config();

const hostname = 'localhost';
const port = 5000;

const app = express();

const db = process.env.MONGODB_URI;

mongoose
  .connect(db)
  .then(() => console.log('Connected to MongoDB server'))
  .catch((err) => console.log(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Routes
 */
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
