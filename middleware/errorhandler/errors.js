const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = process.env;

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || HTTP_STATUS_INTERNAL_SERVER_ERROR;

  const errorResponse = {
    status: false,
    message: "Internal Server Error",
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🍰" : err.stack,
    },
  };

  switch (parseInt(statusCode)) {
    case parseInt(HTTP_STATUS_BAD_REQUEST):
      errorResponse.message = "Bad Request";
      break;
    case parseInt(HTTP_STATUS_UNAUTHORIZED):
      errorResponse.message = "Unauthorized";
      break;
    case parseInt(HTTP_STATUS_NOT_FOUND):
      errorResponse.message = "Not Found";
      break;
    default:
      break;
  }

  return res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
