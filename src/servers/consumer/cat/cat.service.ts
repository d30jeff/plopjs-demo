import { BadRequestException } from '@exceptions/http-exception';
import { Prisma } from '@prisma/client';
import { database } from '@providers/database.provider';
import { CustomLogger, Logger } from '@providers/logger.provider';
import { CatPublicSelect, CatWithPublicFields } from '@repositories/cat.repository';
import { repositories } from '@repositories/index.repository';
import { CatAlreadyExists, CatNotFound } from '@servers/consumer/cat/cat.exception';
import { Cat } from '@servers/consumer/cat/cat.interface';
import { Pagination } from '@utils/pagination.util';

export class CatService {
  @Logger()
  private readonly logger: CustomLogger;

  async create(params: Cat.CreateParams) {
    const { name } = params;

    if (!name) {
      throw new BadRequestException('Name is required', {
        field: 'name',
        description: 'Name is required',
        location: 'Body',
      });
    }

    return database.write.$transaction(async (tx) => {
      const existing = await repositories.cat.findFirst(
        {
          where: {
            name,
          },
        },
        tx
      );

      if (existing) {
        throw new CatAlreadyExists();
      }

      return repositories.cat.create(
        {
          select: CatPublicSelect,
          data: {
            name,
          } as Prisma.CatCreateInput,
        },
        tx
      );
    }) as unknown as CatWithPublicFields;
  }

  async list(params: Cat.ListParams) {
    const { page, limit } = params;

    const total = await repositories.cat.count({});
    const items = await repositories.cat.findMany({
      select: CatPublicSelect,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items as unknown as CatWithPublicFields[],
      pagination: new Pagination({
        page,
        limit,
        total,
      }),
    };
  }

  async findOne(params: Cat.FindOneParams) {
    const { ID } = params;

    const data = await repositories.cat.findFirst({
      select: CatPublicSelect,
      where: {
        ID,
      },
    });

    if (!data) {
      throw new CatNotFound();
    }

    return data as unknown as CatWithPublicFields;
  }

  async update(params: Cat.UpdateParams) {
    const { ID, name } = params;

    await this.findOne({ ID });

    return database.write.$transaction(async (tx) => {
      const existing = await repositories.cat.findFirst(
        {
          where: {
            AND: [
              {
                name,
              },
              {
                ID: {
                  not: ID,
                },
              },
            ],
          },
        },
        tx
      );

      if (existing) {
        throw new CatAlreadyExists();
      }

      return repositories.cat.update(
        {
          data: {
            name,
          },
          where: {
            ID,
          },
        },
        tx
      );
    }) as unknown as CatWithPublicFields;
  }

  async delete(params: Cat.DeleteParams) {
    const { ID } = params;

    await this.findOne({ ID });

    return repositories.cat.delete({
      where: {
        ID,
      },
    });
  }
}
