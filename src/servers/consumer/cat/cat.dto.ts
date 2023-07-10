import { IsDefined } from 'class-validator';

export class CreateCatDto {
  @IsDefined()
  name: string;
}

export class UpdateCatDto extends CreateCatDto {}
