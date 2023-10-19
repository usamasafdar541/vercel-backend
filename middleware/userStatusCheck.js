// Middleware to check if the user is activated or deactivated
const Users = require("../modles/userModel");
const checkUserStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (user.status === "deactivated") {
      return res.status(403).json({
        status: false,
        message: "User is deactivated. Contact support for assistance.",
      });
    } else if (user.status === "activated") {
      // If the user is activated, proceed to the next middleware or route handler
      next();
    } else {
      // Handle other status values if needed
      return res.status(403).json({
        status: false,
        message: "User status is invalid.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Apply the checkUserStatus middleware to routes that require an active user
app.post("/some-protected-route/:id", checkUserStatus, async (req, res) => {
  // Your route logic for an active user
});
