/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./routes/api/auth');

const articles = require('./routes/api/articles');

const gifs = require('./routes/api/gifs');

const profile = require('./routes/api/profile');
const feed = require('./routes/api/feed');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const port = process.env.PORT || 4100;

app.get('/', (req, res) => {
  res.status(200).json({ success: `Welcome to teamwork application` });
});

// use routes

app.use('/api/v1/auth', auth);
app.use('/api/v1/articles', articles);
app.use('/api/v1/gifs', gifs);
app.use('/api/v1/profile', profile);
app.use('/api/v1/feed', feed);

app.listen(port, () => {
  console.log(`The app is running on port ${port}`);
});
