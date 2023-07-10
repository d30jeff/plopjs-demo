import { serializePaginationParams } from '@utils/pagination.util';
import {
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from '@interfaces/express.interface';
import {
  Controller,
  Delete,
  Get,
  Next,
  Params,
  Post,
  Put,
  Request,
  Response,
} from '@decorators/express';
import { CustomLogger, Logger } from '@providers/logger.provider';
import { HttpStatus } from '@enums/http-status.enum';
import { validate } from '@utils/class-validator.util';
import { CreateCatDto, UpdateCatDto } from '@servers/consumer/cat/cat.dto';
import { services } from '@servers/consumer/consumer.services';
import { CatResponse } from '@servers/consumer/cat/cat.response';

@Controller('/cats')
export class CatController {
  @Logger()
  private readonly logger: CustomLogger;

  @Post('/')
  async create(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      const body = await validate<CreateCatDto>(CreateCatDto, request.body);
      const data = await services.cat.create(body);
      return response.status(HttpStatus.Created).json(new CatResponse(data));
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }

  @Get('/')
  async list(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      const { page, limit } = serializePaginationParams(request);
      const { items, pagination } = await services.cat.list({
        page,
        limit,
      });

      return response.status(HttpStatus.Ok).json({
        items: items.map((item) => {
          return new CatResponse(item);
        }),
        pagination,
      });
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }

  @Get('/:ID')
  async get(
    @Params('ID') ID: string,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      const data = await services.cat.findOne({
        ID,
      });

      return response.status(HttpStatus.Ok).json(new CatResponse(data));
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }

  @Put('/:ID')
  async update(
    @Params('ID') ID: string,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      const body = await validate<UpdateCatDto>(UpdateCatDto, request.body);

      const data = await services.cat.update({
        ...body,
        ID,
      });

      return response.status(HttpStatus.Ok).json(new CatResponse(data));
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }

  @Delete('/:ID')
  async delete(
    @Params('ID') ID: string,
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
    @Next() next: ExpressNextFunction
  ) {
    try {
      await services.cat.delete({
        ID,
      });

      return response.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      this.logger.fatal(error);
      next(error);
    }
  }
}
