const Listings = require("../models/listing");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/tilesets");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let alldata = await Listings.find({});
  res.render("listings/index.ejs", { alldata });
};

module.exports.RenderNew = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.PostNew = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newlist = req.body;
  console.log(url);
  console.log(filename);
  const newlisting = new Listings(newlist);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const item = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!item) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { item });
};

module.exports.RenderEditForm = async (req, res) => {
  let { id } = req.params;
  const item = await Listings.findById(id);
  if (!item) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  }
  let originalUrl = item.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { item, originalUrl });
};

module.exports.UpdateRoute = async (req, res) => {
  let { id } = req.params;
  if (!req.body) {
    throw new ExpressError(400, "Invalid Data");
  }
  const listing = await Listings.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permissions to edit this");
    return res.redirect(`/listings/${id}`);
  }
  const updatedlisting = await Listings.findByIdAndUpdate(id, { ...req.body });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedlisting.image = { url, filename };
    await updatedlisting.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.DeleteListing = async (req, res) => {
  let { id } = req.params;
  await Listings.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
