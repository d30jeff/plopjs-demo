import { Controller, Get, Next, Request, Response } from '@decorators/express';
import { HttpStatus } from '@enums/http-status.enum';
import {
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from '@interfaces/express.interface';
import { CustomLogger, Logger } from '@providers/logger.provider';
import { serializePaginationParams } from '@utils/pagination.util';

@Controller('/healthcheck')
export class HealthcheckController {
  @Logger()
  private readonly logger: CustomLogger;

  @Get('/')
  async get(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      return response.status(HttpStatus.Ok).json({
        service: 'Consumer API',
        message: 'Service is up and running 🚀',
      });
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }
}
