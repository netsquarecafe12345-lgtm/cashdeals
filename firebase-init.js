// firebase-init.js
// Small shim that re-exports the auth and db singletons from your existing app.js.
// Place this file in the repository root (same folder as app.js and index.html).

import { auth, db } from './app.js';
export { auth, db };