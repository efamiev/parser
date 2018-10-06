import request from 'request';

import avitoHandler from './handlers/avitoHandler';
import { proxy, avitoUrl, fiveMinuteInterval } from './constants';

const avitoRequest = () => request(
  {
    url: avitoUrl,
    proxy
  },
  avitoHandler
);

avitoRequest();

setInterval(avitoRequest, fiveMinuteInterval);
