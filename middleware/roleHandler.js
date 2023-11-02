const adminHandler = (req, res, next) => {
  try {
    if (req.user && req.user.roles && req.user.roles.includes("admin")) {
      console.log("User roles:", req.user.roles, req.user);
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "User does not have the required role",
      });
    }
  } catch (error) {
    console.error("Error in adminHandler:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};

module.exports = adminHandler;
