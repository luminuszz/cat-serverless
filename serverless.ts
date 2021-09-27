import 'reflect-metadata';
import '@libs/inject';

import type { AWS } from '@serverless/typescript';

import webscrapping from '@functions/wbs';

const serverlessConfiguration: AWS = {
  service: 'pc-web-scrapping',
  frameworkVersion: '2',
  package: {
    patterns: ['!node_modules/puppeteer/.local-chromium/**', '!.virtualenv/**'],
  },
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-offline', 'serverless-webpack'],
  provider: {
    name: 'aws',

    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      URL_PATH: 'https://http.cat',
      NODE_ENV: 'TEST',
    },

    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['translate:TranslateText'],
        Resource: '*',
      },
    ],

    lambdaHashingVersion: '20201221',
  },

  functions: { webscrapping },
};

module.exports = serverlessConfiguration;
