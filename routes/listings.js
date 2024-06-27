const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.PostNew)
  );

//new route
router.get("/new", isLoggedin, listingController.RenderNew);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.UpdateRoute)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingController.DeleteListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.RenderEditForm)
);

module.exports = router;
