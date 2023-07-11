import { Server } from 'http';
import { HttpStatus } from '@enums/http-status.enum';
import { config } from '@providers/config.provider';
import { repositories } from '@repositories/index.repository';
import { controllers } from '@servers/consumer/consumer.controllers';
import { createApplication } from '@utils/application.util';
import request, { SuperAgentTest } from 'supertest';

describe('Cat Controller', () => {
  let instance: SuperAgentTest;
  let server: Server;
  beforeAll(async () => {
    const { app } = await createApplication({
      name: 'Consumer Test',
      controllers,
      origin: [],
    });

    await new Promise<void>((resolve) => {
      server = app.listen(config.CONSUMER_API_PORT, () => {
        instance = request.agent(server);
        resolve();
      });
    });
  });

  afterAll(async () => {
    await repositories.cat.deleteMany({});
    server.close();
  });

  describe('POST /v1/cats', () => {
    it('Should Validate Fields', async () => {
      const response = await instance.post('/v1/cats').send({});
      expect(response.statusCode).toBe(HttpStatus.BadRequest);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('ValidationError');
      expect(response.body.error.errors).toBeDefined();
      expect(response.body.error.message).toBe('Validation Error');

      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.requestID).toBeDefined();
      expect(response.body.metadata.resource).toBe('/v1/cats');
      expect(response.body.metadata.statusCode).toBe(HttpStatus.BadRequest);
      expect(response.body.metadata.timestamp).toBeDefined();
    });

    it('Should Create A Cat Record', async () => {
      const response = await instance.post('/v1/cats').send({
        name: 'Cat',
      });

      expect(response.statusCode).toBe(HttpStatus.Created);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.ID).toBeDefined();
      expect(response.body.data.name).toBe('Cat');
      expect(response.body.data.createdAt).toBeDefined();

      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.requestID).toBeDefined();
      expect(response.body.metadata.resource).toContain('/v1/cats');
      expect(response.body.metadata.statusCode).toBe(HttpStatus.Created);
      expect(response.body.metadata.timestamp).toBeDefined();
    });

    it('Should Prevent Duplicate Cat Record', async () => {
      const response = await instance.post('/v1/cats').send({
        name: 'Cat',
      });

      expect(response.statusCode).toBe(HttpStatus.Conflict);

      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('CatAlreadyExists');
      expect(response.body.error.message).toBe('Cat Already Exists');

      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.requestID).toBeDefined();
      expect(response.body.metadata.resource).toContain('/v1/cats');
      expect(response.body.metadata.statusCode).toBe(HttpStatus.Conflict);
      expect(response.body.metadata.timestamp).toBeDefined();
    });
  });
});
