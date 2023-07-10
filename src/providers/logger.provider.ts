import { config } from '@providers/config.provider';
import { Signale } from 'signale';

export const SignaleLogger = (name: string): Signale => {
  return new Signale({
    scope: `${config.NODE_ENV.toUpperCase()} ${name}`,
    config: {
      displayTimestamp: true,
      displayBadge: true,
    },
  });
};

export type CustomLogger = Signale;

export const Logger = () => {
  return (target, key: string | symbol) => {
    const getter = () => {
      return SignaleLogger(target.constructor.name);
    };

    Object.defineProperty(target, key, {
      get: getter,
      enumerable: true,
      configurable: true,
    });
  };
};
