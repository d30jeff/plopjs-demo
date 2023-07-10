import { config } from '@providers/config.provider';
import { controllers } from '@servers/consumer/consumer.controllers';
import { services } from '@servers/consumer/consumer.services';
import { createApplication } from '@utils/application.util';

async function main() {
  const { app, logger } = await createApplication({
    controllers,
    name: 'Consumer API',
    staticPaths: [
      {
        prefix: '/',
        path: 'docs/consumer',
      },
    ],
    origin: [config.CONSUMER_FRONTEND],
  });

  app.listen(config.CONSUMER_API_PORT, async () => {
    logger.info('Consumer is running on port %s', config.CONSUMER_API_PORT);
  });
}

main();
