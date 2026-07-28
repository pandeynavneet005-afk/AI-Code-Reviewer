/**
 * Wraps an async Express route handler so that any rejected promise is
 * automatically forwarded to the `next(err)` error-handling middleware,
 * instead of requiring a try/catch block in every controller.
 */
module.exports = function catchAsync(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
