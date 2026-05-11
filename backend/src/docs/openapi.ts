/**
 * OpenAPI document generator
 *
 * Imports docs/index.ts first to trigger all module
 * route registrations before the document is built.
 */

import './index';

import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import { registry } from './registry';

import config from '../config';

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',

  info: {
    title: 'Quick Cart API',
    version: '1.0.0',
    description: 'RESTful API for Quick Cart e-commerce platform',
  },

  servers: [
    {
      url: `http://localhost:${config.PORT}`,
      description: 'Local development server',
    },
  ],
});
