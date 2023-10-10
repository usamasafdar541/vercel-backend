const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token from the Authorization header
    token = authHeader.split(" ")[1];

    try {
      // Verify the token with the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({
          message: "Token has expired",
        });
      }

      // Attach the decoded user to the request object
      req.user = decoded.user;
      console.log(decoded);

      // Call the next middleware in the chain
      next();
    } catch (error) {
      // If verification fails, handle the error
      res.status(401).json({
        message: "User is not authorized",
        error: error.message,
      });
    }
  } else {
    res.status(401).json({
      message: "User is not authorized or Token is missing",
    });
  }
});

module.exports = validateToken;
