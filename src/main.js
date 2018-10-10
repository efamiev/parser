import request from 'request';
import mongoose from 'mongoose';

import avitoHandler from './handlers/avitoHandler';
import {
  proxy, avitoUrl, fiveMinuteInterval, mongoURI
} from './constants';

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
