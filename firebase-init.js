// firebase-init.js (diagnostic)
import { auth, db } from './app.js';

console.log('[firebase-init] auth?', !!auth, 'db?', !!db);
console.log('[firebase-init] auth type:', typeof auth, 'db type:', typeof db);

export { auth, db };
