import { HttpStatus } from '@enums/http-status.enum';
import { SignaleLogger } from '@providers/logger.provider';
import { dayjs } from '@utils/dayjs.util';
import { ValidationError } from 'class-validator';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { getFormattedPath } from '@utils/request.util';
import { ErrorMiddleware } from '@decorators/express';
import { BaseException } from '@exceptions/http-exception';

const logger = SignaleLogger('Global Error Handler');

const extractPropertiesAndConstraint = (
  validationErrors: ValidationError[],
  errors: any[],
  property: string = ''
) => {
  for (const validationError of validationErrors) {
    errors.push({
      [property || validationError.property]: validationError.constraints,
    });
    if (validationError.children) {
      for (const child of validationError.children) {
        extractPropertiesAndConstraint(
          [child],
          errors,
          [validationError.property, child.property].join('.')
        );
      }
    }
  }
};

export class GlobalErrorMiddleware implements ErrorMiddleware {
  public use(e: Error, request: Request, response: Response, next: NextFunction) {
    const timestamp = dayjs().utc().format();
    const error = e as unknown as ErrorRequestHandler & { statusCode: number; details: string };
    logger.fatal(error);

    if (error.length && error.constructor === Array) {
      const errors = [];
      extractPropertiesAndConstraint(error, errors);
      return response.status(HttpStatus.BadRequest).json({
        error: {
          code: 'ValidationError',
          message: 'Validation Error',
          errors: errors.filter((error) => {
            return Object.values(error).filter((item) => {
              return Boolean(item);
            }).length;
          }),
        },
        metadata: {
          statusCode: HttpStatus.BadRequest,
          resource: getFormattedPath(request),
          timestamp,
          requestID: request.id,
        },
      });
    }

    if (error instanceof BaseException) {
      return response.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          errors: error.errors ?? error.errors,
          details: error.details ?? error.details,
        },
        metadata: {
          statusCode: error.statusCode,
          resource: getFormattedPath(request),
          timestamp,
          requestID: request.id,
        },
      });
    }

    return response.status(HttpStatus.InternalServerError).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
      metadata: {
        statusCode: error.statusCode,
        resource: getFormattedPath(request),
        timestamp,
        requestID: request.id,
      },
    });
  }
}

export const globalErrorMiddleware = () => {
  return (
    error: ErrorRequestHandler & { statusCode: number; details: string },
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const timestamp = dayjs().utc().format();
    logger.fatal(error);
    console.log(222);

    if (error.length && error.constructor === Array) {
      const errors = [];
      extractPropertiesAndConstraint(error, errors);
      return response.status(HttpStatus.BadRequest).json({
        error: {
          code: 'ValidationError',
          message: 'Validation Error',
          errors: errors.filter((error) => {
            return Object.values(error).filter((item) => {
              return Boolean(item);
            }).length;
          }),
        },
        metadata: {
          statusCode: HttpStatus.BadRequest,
          resource: getFormattedPath(request),
          timestamp,
          requestID: request.id,
        },
      });
    }

    if (error instanceof BaseException) {
      return response.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          errors: error.errors ?? error.errors,
          details: error.details ?? error.details,
        },
        metadata: {
          statusCode: error.statusCode,
          resource: getFormattedPath(request),
          timestamp,
          requestID: request.id,
        },
      });
    }

    return response.status(HttpStatus.InternalServerError).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      },
      metadata: {
        statusCode: error.statusCode,
        resource: getFormattedPath(request),
        timestamp,
        requestID: request.id,
      },
    });
  };
};
