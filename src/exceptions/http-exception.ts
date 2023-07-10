import { HttpStatus } from '@enums/http-status.enum';
import { StringUtil } from '@utils/string.util';

type ErrorLocation = 'Header' | 'Body' | 'Query';

export interface ErrorField {
  field: string;
  location: ErrorLocation;
  description: string;
}

export abstract class BaseException {
  code: string;
  statusCode: HttpStatus;
  message: string;
  errors?: ErrorField;
  details: string | object;
}

export interface HttpExceptionProps {
  status: HttpStatus;
  code?: string;
  message: string;
  details: string | object;
  errors?: ErrorField;
}

export class HttpException extends BaseException {
  constructor(props: HttpExceptionProps) {
    super();
    const { status, message, code, errors, details } = props;
    this.statusCode = status;
    this.message = message;
    this.errors = errors;
    this.details = details;
    this.code = code || StringUtil.PascalCase(message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, errors?: ErrorField, code: string = 'BadRequest', details = '') {
    super({
      status: HttpStatus.BadRequest,
      code,
      message,
      details,
      errors,
    });
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized', code: string, details = '') {
    super({
      status: HttpStatus.Unauthorized,
      message,
      code,
      details,
    });
  }
}
export class ForbiddenException extends HttpException {
  constructor(message: string, details = '') {
    super({
      status: HttpStatus.Forbidden,
      message,
      code: '',
      details,
    });
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string, code?: string, details = '') {
    super({
      status: HttpStatus.NotFound,
      message,
      code,
      details,
    });
  }
}

export class ConflictException extends HttpException {
  constructor(message: string, code?: string, details: string | object = {}) {
    super({
      status: HttpStatus.Conflict,
      message,
      code,
      details,
    });
  }
}

export class PaymentRequiredException extends HttpException {
  constructor(message: string, code?: string, details = '') {
    super({
      status: HttpStatus.PaymentRequired,
      message,
      code,
      details,
    });
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(message: string, code?: string, details = '') {
    super({
      status: HttpStatus.UnprocessableEntity,
      message,
      code,
      details,
    });
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string, code?: string, details = '') {
    super({
      status: HttpStatus.TooManyRequests,
      message,
      code,
      details,
    });
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Something went wrong', code?: string, details = '') {
    super({
      status: HttpStatus.InternalServerError,
      message,
      code,
      details,
    });
  }
}
