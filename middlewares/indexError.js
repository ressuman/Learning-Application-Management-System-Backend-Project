class IndexError extends Error {
  constructor(message, statusCode) {
    super(message);

    // Set the statusCode and determine the status based on it
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";

    // Ensure the name property matches the class name for easier debugging
    this.name = this.constructor.name;

    // Capture the stack trace, excluding this constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default IndexError; // Use this if you're working in a module-based project
