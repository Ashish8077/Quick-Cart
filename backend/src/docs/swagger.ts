import swaggerUi from 'swagger-ui-express';

import type { Express } from 'express';

import { openApiDocument } from '../docs/openapi';

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
};
