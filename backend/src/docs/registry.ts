import { z } from 'zod';

import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

/**
 * Extend Zod with .openapi() method.
 *
 * MUST be called before any schema uses .openapi().
 * This file is imported first by docs/index.ts and openapi.ts,
 * so this runs before any module schema is evaluated.
 */

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();
