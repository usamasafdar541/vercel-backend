const adminHandler = (req, res, next) => {
  console.log("User roles:", req.user.roles); // Log roles for debugging
  if (req.user && req.user.roles.includes("admin")) {
    next();
  } else {
    res.status(403).json({
      status: false,
      message: "User does not have the required role",
    });
  }
};

module.exports = adminHandler;
