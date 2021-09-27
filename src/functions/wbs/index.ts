import 'reflect-metadata';
import '@libs/inject';

import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'scrapping',
        cors: true,
      },
    },
  ],
};
