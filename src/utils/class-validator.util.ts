import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export async function validate<T>(cls: ClassConstructor<any>, plain: object): Promise<T> {
  const object = plainToInstance(cls, plain);

  if (!object) {
    return null;
  }

  await validateOrReject(object, {
    whitelist: true,
  });

  return object;
}
