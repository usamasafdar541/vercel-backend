const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];

    try {
      // Verify the token with the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({
          status: false,
          message: "Token has expired",
        });
      }
      console.log("Request headers:", req.headers);

      req.user = decoded;
      console.log("decoded user is here:", decoded);

      next();
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "User is not authorized",
      });
    }
  } else {
    res.status(401).json({
      message: "User is not authorized or Token is missing",
    });
  }
});

module.exports = validateToken;
