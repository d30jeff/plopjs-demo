import { createApplication } from '@utils/application.util';
import { config } from '@providers/config.provider';
import { controllers } from '@servers/admin/admin.controllers';

async function main() {
  const { app, logger } = await createApplication({
    name: 'Admin',
    controllers,
    origin: [],
    staticPaths: [
      {
        prefix: '/',
        path: 'docs/admin',
      },
    ],
  });

  app.listen(config.ADMIN_PORT, async () => {
    logger.success(`Admin is running on port ${config.ADMIN_PORT} 🚀`, {
      ...config,
    });
  });
}

main();
