const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");
// const checkController = require("../../controllers/checkInOutController");
const validator = require("../../middleware/validateToken");
//admin role handler
const adminHandler = require("../../middleware/roleHandler");
router.post("/register", adminController.addAdmin);
router.post(
  "/createuser",
  validator,
  adminHandler,
  adminController.createNewUser
);
router.post(
  "/deactivate/:id",
  adminHandler,
  validator,
  adminController.deactivateUser
);
router.post(
  "/activate/:id",
  adminHandler,
  validator,
  adminController.activateUser
);

router.put("/update/:id", validator, adminHandler, adminController.updateUser);

router.delete(
  "/delete/:id",
  validator,
  adminHandler,
  adminController.deleteUser
);

module.exports = router;
