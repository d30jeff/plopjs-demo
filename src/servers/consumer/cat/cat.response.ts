import { CatWithPublicFields } from '@repositories/cat.repository';
import { CommonResponse } from '@responses/common.response';

export class CatResponse extends CommonResponse {
  name: string;
  constructor(params: CatWithPublicFields) {
    super(params);
    this.name = params.name;
  }
}
