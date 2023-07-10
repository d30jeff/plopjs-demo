import { CatController } from '@servers/consumer/cat/cat.controller';
import { HealthcheckController } from '@servers/consumer/healthcheck/healthcheck.controller';

export const controllers = [
  HealthcheckController,
  CatController,
];
