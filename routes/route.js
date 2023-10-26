const express = require("express");
const router = express.Router();
const contactRoutes = require("../routes/contactRoutes/contactRoutes");
const userRoutes = require("../routes/user/userRoutes");
const adminRoutes = require("../routes/admin/adminRoutes");
// Use the route modules for specific paths
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/contacts", contactRoutes);
module.exports = router;
