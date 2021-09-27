import 'reflect-metadata';
import '@libs/inject';

import 'source-map-support/register';

import { container, injectable } from 'tsyringe';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { browserConnectionFactory } from '@libs/browserConfig';

import { LambadaHandler } from '@libs/HandlerLambda';
import { formatJSONResponse } from '@libs/apiGateway';

@injectable()
class Handler implements LambadaHandler {
  private static async getConnection() {
    return browserConnectionFactory();
  }

  private static mountUrlFactory(statusCode: string) {
    const { URL_PATH } = process.env;
    return `${URL_PATH}/${statusCode}`;
  }

  async main({ queryStringParameters }: APIGatewayProxyEvent) {
    const { statusCode } = queryStringParameters;

    if (!statusCode) {
      throw new Error('Not parameters');
    }

    const url = Handler.mountUrlFactory(statusCode);

    const browser = await Handler.getConnection();

    try {
      const page = await browser.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      const img = await page.$eval('img', (img: HTMLImageElement) => img.src);

      return formatJSONResponse({ message: img });
    } catch (e) {
      return {
        statusCode: 500,
        body: e.message || 'interval sever error',
      };
    } finally {
      await browser.close();
    }
  }
}

const handlerInstance = container.resolve(Handler);

export const main = middyfy(handlerInstance.main.bind(handlerInstance));
