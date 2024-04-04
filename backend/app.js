const express = require('express');
const mongoose = require('mongoose');
// const config = require('config');
const dotenv = require('dotenv');

dotenv.config();

const hostname = 'localhost';
const port = 5000;

const app = express();

// const db = config.get('mongoURI');
const db = process.env.MONGODB_URI;

mongoose
  .connect(db)
  .then(() => console.log('Connected to MongoDB server'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
