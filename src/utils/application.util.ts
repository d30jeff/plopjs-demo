require('source-map-support').install();
import { Container } from '@decorators/di';
import { ERROR_MIDDLEWARE, attachControllers } from '@decorators/express';
import express, { Express, Router } from 'express';
import requestID from 'express-request-id';
import { json, raw, urlencoded } from 'body-parser';
import mung from 'express-mung';
import { responseInterceptor } from '@utils/response.util';
import { GlobalErrorMiddleware } from '@middlewares/error.middleware';
import { config } from '@providers/config.provider';
import morgan from 'morgan';
import { dayjs } from '@utils/dayjs.util';
import { SignaleLogger } from '@providers/logger.provider';
import { Signale } from 'signale';

export type CreateApplicationParams = {
  name: string;
  controllers: any[];
  origin: string[];
  staticPaths?: Array<{ prefix: string; path: string }>;
};

export const createApplication = async (
  params: CreateApplicationParams
): Promise<{
  app: Express;
  logger: Signale;
}> => {
  const { name, controllers, staticPaths } = params;
  const app = express();

  if (!name) {
    throw new Error('Application name is required');
  }

  const logger = SignaleLogger(name);

  morgan.token('requestID', (req) => {
    return req.id;
  });

  app.use(
    requestID({
      headerName: 'X-Request-ID',
    }),
    json({
      limit: '500kb',
    })
  );

  app.use(mung.jsonAsync(responseInterceptor));

  const router = Router();
  attachControllers(router, controllers);

  if (config.NODE_ENV === 'development' && staticPaths && staticPaths.length) {
    for (const { prefix, path } of staticPaths) {
      app.use(prefix, express.static(path));
    }
  }

  app.use('/v1', router);

  Container.provide([{ provide: ERROR_MIDDLEWARE, useClass: GlobalErrorMiddleware }]);
  app.use((request, response, next) => {
    return response.status(404).json({
      error: {
        code: 'Not Found',
        message: 'Route Not Found',
      },
      metadata: {
        statusCode: 404,
        resource: request.path,
        timestamp: dayjs().utc().format(),
        requestID: request.id,
      },
    });
  });

  return {
    app,
    logger,
  };
};
