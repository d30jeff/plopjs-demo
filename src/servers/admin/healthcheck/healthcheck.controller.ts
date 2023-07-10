import { Controller, Get, Next, Request, Response } from '@decorators/express';
import {
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from '@interfaces/express.interface';
import { CustomLogger, Logger } from '@providers/logger.provider';
import { HttpStatus } from '@enums/http-status.enum';

@Controller('/healthcheck')
export class HealthcheckController {
  @Logger()
  private readonly logger: CustomLogger;

  @Get('/')
  async healthcheck(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      return response.status(HttpStatus.Ok).json({
        status: '🚀 Service is up and running',
        service: 'Admin API',
      });
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }
}
