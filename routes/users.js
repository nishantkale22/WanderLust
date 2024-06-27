const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const {
  RenderSignupForm,
  SignupUser,
  RenderLoginForm,
  loginUser,
  logout,
} = require("../controllers/userController.js");

router.route("/signup").get(RenderSignupForm).post(wrapAsync(SignupUser));

router
  .route("/login")
  .get(RenderLoginForm)
  .post(
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginUser
  );
router.get("/logout", logout);

module.exports = router;
