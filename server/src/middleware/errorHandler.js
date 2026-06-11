export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}`;
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }
  res.status(statusCode).json({ message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
};
