import { CreateCatDto } from '@servers/consumer/cat/cat.dto';
import { PaginationQueries } from '@utils/pagination.util';

export namespace Cat {
  export type CreateParams = CreateCatDto;

  export type ListParams = PaginationQueries;

  export type FindOneParams = {
    ID: string;
  };

  export type UpdateParams = CreateParams & FindOneParams;

  export type DeleteParams = FindOneParams;
}
