const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync");

const userController = require("../controllers/users.js");
// SIGNUP FORM
router.get("/signup", userController.renderSignupForm );

// SIGNUP LOGIC
router.post(
  "/signup",
  wrapAsync(userController.signup)
);

// LOGIN FORM
router.get("/login", userController.renderloginForm);

// LOGIN LOGIC  ✅ FIXED
router.post(
  "/login",
  savedRedirectUrl, // MUST be a function
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;