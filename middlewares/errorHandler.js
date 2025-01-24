const errorHandler = (err, req, res, next) => {
  // Set default values for the error's statusCode and status if they are undefined
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Respond with the error details in JSON format
  res.status(err.statusCode).json({
    status: err.status,
    error: process.env.NODE_ENV === "development" ? err : undefined, // Only include the full error in development
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace only in development
  });
};

export default errorHandler;
