const request = require('request');
const mongoose = require('mongoose');

const avitoHandler = require('./handlers/avitoHandler');
const {
  proxy, avitoUrl, fiveMinuteInterval, mongoURI
} = require('./constants');

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB connecting'))
  .catch(err => console.log(err));

const avitoRequest = () => request(
  {
    url: avitoUrl,
    proxy
  },
  avitoHandler
);

avitoRequest();

setInterval(avitoRequest, fiveMinuteInterval);
