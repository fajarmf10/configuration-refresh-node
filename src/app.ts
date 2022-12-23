import express from 'express';
import compression = require('compression');
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { init } from './init';
import { Pool } from 'pg';
import { errorHandler } from './middlewares/handle-error-code';

export async function createApp(): Promise<{ app: express.Application, pool: Pool }> {
  const {
    healthcheckController,
    configController,
    pool,
    app,
  } = await init();

  app.set('port', process.env.PORT || 3000);
  app.use(compression());
  app.use(express.json());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());

  app.use('/healthcheck', healthcheckController.getRouter());
  app.use('/', configController.getRouter());

  app.use(errorHandler());

  return {
    app,
    pool,
  };
}
