require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app  = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const port = 3000;
const tempPass = `sc0YIZfz04L491WM`
const mongoUri = `mongodb+srv://setoseng:${tempPass}@cluster0.knbcc63.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
  console.log('Connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('Error Connecting to Mongo', err);
});

app.get('/', requireAuth, (req, res)=> {
  res.send(`Your email is ${req.user.email}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});