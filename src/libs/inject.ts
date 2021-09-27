import { container } from 'tsyringe';
import * as aws from 'aws-sdk';

import * as Puppeteer from 'puppeteer-core';

export enum MeTaDataKeys {
  PUPPETEER = 'PUPPETEER',
  AWS_TRANSLATE = 'AWS_TRANSLATE',
}

container.registerInstance<typeof Puppeteer>(MeTaDataKeys.PUPPETEER, Puppeteer);

container.registerSingleton<aws.Translate>(
  MeTaDataKeys.AWS_TRANSLATE,
  aws.Translate,
);
