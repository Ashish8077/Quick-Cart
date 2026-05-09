/**
 * OpenAPI docs index
 *
 * 1. Import security schemes first (registers auth globally)
 * 2. Import each module's .docs.ts file to register routes
 *
 * Add one import line here each time you create a new module.
 */

import './security';

import '../modules/auth/auth.docs';
// import '../modules/product/product.docs';
// import '../modules/order/order.docs';
// import '../modules/user/user.docs';
