import { Prisma, PrismaClient } from '@prisma/client';
import { config } from '@providers/config.provider';
import { SignaleLogger } from '@providers/logger.provider';
import { generateID } from '@providers/nanoid.provider';
import { StringUtil } from '@utils/string.util';

const logger = SignaleLogger('Prisma');
const log: (Prisma.LogLevel | Prisma.LogDefinition)[] = [
  {
    emit: 'event',
    level: 'query',
  },
  {
    emit: 'stdout',
    level: 'error',
  },
  {
    emit: 'stdout',
    level: 'warn',
  },
  {
    emit: 'stdout',
    level: 'info',
  },
];

const prismaWriteConnection: PrismaClient<Prisma.PrismaClientOptions, 'query'> = new PrismaClient({
  log,
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
});

const prismaReadConnection: PrismaClient<Prisma.PrismaClientOptions, 'query'> = new PrismaClient({
  log,
  datasources: {
    db: {
      url: config.DATABASE_READ_REPLICA_URL,
    },
  },
});

const middleware = async (params: Prisma.MiddlewareParams, next) => {
  if (
    ['create', 'createMany', 'upsert'].includes(params.action) &&
    (params.args.data || params.args.create)
  ) {
    let data = [];
    if (params.args.create && params.action === 'upsert') {
      data = [params.args.create];
    } else if (params.args.data.constructor === Array) {
      data = params.args.data;
    } else {
      data = [params.args.data];
    }

    for (const d of data) {
      d.ID = generateID(StringUtil.SnakeCase(params.model));
    }
  }

  const result = await next(params);
  return result;
};

prismaWriteConnection.$use(middleware);
prismaReadConnection.$use(middleware);

export const database = {
  write: prismaWriteConnection,
  read: prismaReadConnection,
};
