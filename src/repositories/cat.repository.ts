import { database } from '@providers/database.provider';
import { Prisma } from '@prisma/client';

const fields = {
  ID: true,
  name: true,
  createdAt: true,
};

export const CatPublicSelect = Prisma.validator<Prisma.CatSelect>()(fields);

export type CatWithPublicFields = Prisma.CatGetPayload<{
  select: typeof CatPublicSelect;
}>;

export const CatPrivateSelect = Prisma.validator<Prisma.CatSelect>()({
  ...fields,
});

export type CatWithPrivateFields = Prisma.CatGetPayload<{
  select: typeof CatPrivateSelect;
}>;

export class CatRepository {
  aggregate(params: Prisma.CatAggregateArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.cat.aggregate(params);
  }

  upsert(params: Prisma.CatUpsertArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.cat.upsert(params);
  }

  create(params: Prisma.CatCreateArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.cat.create(params);
  }

  createMany(
    params: Prisma.CatCreateManyArgs,
    connection: Prisma.TransactionClient = database.write
  ) {
    return connection.cat.createMany(params);
  }

  findFirst(params: Prisma.CatFindFirstArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.cat.findFirst(params);
  }

  findMany(params: Prisma.CatFindManyArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.cat.findMany(params);
  }

  count(params: Prisma.CatCountArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.cat.count(params);
  }

  update(params: Prisma.CatUpdateArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.cat.update(params);
  }

  updateMany(
    params: Prisma.CatUpdateManyArgs,
    connection: Prisma.TransactionClient = database.write
  ) {
    return connection.cat.updateMany(params);
  }

  delete(params: Prisma.CatDeleteArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.cat.delete(params);
  }

  deleteMany(
    params: Prisma.CatDeleteManyArgs,
    connection: Prisma.TransactionClient = database.write
  ) {
    return connection.cat.deleteMany(params);
  }
}
