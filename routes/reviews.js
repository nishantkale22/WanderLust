const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedin,
  isReviewAuthor,
} = require("../middleware.js");
const {
  AddReview,
  DeleteReview,
} = require("../controllers/reviewController.js");

//Reviews Route
router.post("/", isLoggedin, validateReview, wrapAsync(AddReview));

//DELETE REVIEW
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(DeleteReview)
);

module.exports = router;
