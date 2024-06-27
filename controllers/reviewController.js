const Review = require("../models/reviews.js");
const Listings = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.AddReview = async (req, res) => {
  let item = await Listings.findById(req.params.id);
  // console.log(req.params.id);
  // console.log(req.body);
  let newReview = new Review(req.body.reviews);
  newReview.author = req.user._id;
  await newReview.save();
  item.reviews.push(newReview);
  await item.save();
  req.flash("success", "Review Created");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.DeleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
