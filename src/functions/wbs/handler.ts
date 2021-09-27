import 'reflect-metadata';
import '@libs/inject';

import 'source-map-support/register';

import { container, inject, injectable } from 'tsyringe';
import { middyfy } from '@libs/lambda';
import { browserConnectionFactory } from '@libs/browserConfig';

import { LambadaHandler } from '@libs/HandlerLambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { MeTaDataKeys } from '@libs/inject';
import { Translate } from 'aws-sdk';

@injectable()
class Handler implements LambadaHandler {
  private commitUrl = 'http://whatthecommit.com';

  constructor(
    @inject(MeTaDataKeys.AWS_TRANSLATE)
    private readonly translateService: Translate,
  ) {}

  private static async getConnection() {
    return browserConnectionFactory();
  }

  private async translateContent(content: string) {
    return this.translateService
      .translateText({
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'pt',
        Text: content,
      })
      .promise();
  }

  async main() {
    try {
      const browser = await Handler.getConnection();

      const page = await browser.newPage();

      await page.goto(this.commitUrl, {
        waitUntil: 'networkidle2',
      });

      const commitMessage = await page.$eval(
        'p',
        (p: HTMLParagraphElement) => p.innerText,
      );

      const translatedContent = await this.translateContent(commitMessage);

      await browser.close();

      return formatJSONResponse({
        translatedMessage: translatedContent.TranslatedText,
        originalMessage: commitMessage,
      });
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        body: e.message || 'interval sever error',
      };
    }
  }
}

const handlerInstance = container.resolve(Handler);

export const main = middyfy(handlerInstance.main.bind(handlerInstance));
