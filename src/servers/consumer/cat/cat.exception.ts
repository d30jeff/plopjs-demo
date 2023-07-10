import { ConflictException, NotFoundException } from '@exceptions/http-exception';

export class CatAlreadyExists extends ConflictException {
  constructor() {
    super('Cat Already Exists');
  }
}

export class CatNotFound extends NotFoundException {
  constructor() {
    super('Cat Not Found');
  }
}
