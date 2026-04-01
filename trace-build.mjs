import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const _TypeError = global.TypeError;
global.TypeError = function TraceTypeError(...args) {
  const err = new _TypeError(...args);
  if (args[0] && args[0].includes && args[0].includes('generate')) {
    console.error('CAUGHT TypeError generate:', err.stack);
    process.exit(1);
  }
  return err;
};
global.TypeError.prototype = _TypeError.prototype;
Object.setPrototypeOf(global.TypeError, _TypeError);

const require = createRequire(import.meta.url);
require('./node_modules/next/dist/build/index.js');
