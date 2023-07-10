import { Prisma } from '@prisma/client';
import { database } from '@providers/database.provider';

const fields = {
  ID: true,
  createdAt: true,
  updatedAt: true,
};

export const DogPublicSelect = Prisma.validator<Prisma.DogSelect>()(fields);

export type DogWithPublicFields = Prisma.DogGetPayload<{
  select: typeof DogPublicSelect;
}>;

export const DogPrivateSelect = Prisma.validator<Prisma.DogSelect>()({
  ...fields,
});

export class DogRepository {
  aggregate(params: Prisma.DogAggregateArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.dog.aggregate(params);
  }

  upsert(params: Prisma.DogUpsertArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.dog.upsert(params);
  }

  create(params: Prisma.DogCreateArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.dog.create(params);
  }

  createMany(
    params: Prisma.DogCreateManyArgs,
    connection: Prisma.TransactionClient = database.write
  ) {
    return connection.dog.createMany(params);
  }

  findFirst(params: Prisma.DogFindFirstArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.dog.findFirst(params);
  }

  findMany(params: Prisma.DogFindManyArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.dog.findMany(params);
  }

  count(params: Prisma.DogCountArgs, connection: Prisma.TransactionClient = database.read) {
    return connection.dog.count(params);
  }

  update(params: Prisma.DogUpdateArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.dog.update(params);
  }

  delete(params: Prisma.DogDeleteArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.dog.delete(params);
  }

  deleteMany(params: Prisma.DogDeleteManyArgs, connection: Prisma.TransactionClient = database.write) {
    return connection.dog.deleteMany(params);
  }
}
