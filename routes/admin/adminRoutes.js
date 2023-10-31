const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/adminController");
const multerMiddleware = require("../../middleware/fileupload/fileUpload");
const validator = require("../../middleware/validateToken");
const adminHandler = require("../../middleware/roleHandler");

router.post("/register", adminController.addAdmin);
router.post(
  "/createuser",
  multerMiddleware,
  validator,
  adminHandler,
  adminController.createNewUser
);

module.exports = router;
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
