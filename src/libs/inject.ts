import { container } from 'tsyringe';

import * as Puppeteer from 'puppeteer-core';

export enum MeTaDataKeys {
  PUPPETEER = 'PUPPETEER',
}

container.registerInstance<typeof Puppeteer>(MeTaDataKeys.PUPPETEER, Puppeteer);
