const OrigTypeError = global.TypeError;

function TracingTypeError(msg) {
  const err = new OrigTypeError(msg);
  if (typeof msg === 'string' && msg.includes('generate')) {
    const traceErr = new OrigTypeError('TRACE_generate');
    Error.captureStackTrace(traceErr, TracingTypeError);
    console.error('=== GENERATE TypeError ===\n' + traceErr.stack);
    process.exit(0);
  }
  return err;
}
TracingTypeError.prototype = OrigTypeError.prototype;
Object.setPrototypeOf(TracingTypeError, OrigTypeError);
global.TypeError = TracingTypeError;

process.argv = ['node', 'next', 'build'];
require('./node_modules/next/dist/bin/next');
