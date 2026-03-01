const Listing = require("../models/listing");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  return res.render("listings/new.ejs");
};

// SHOW LISTING
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  // if listing deleted or wrong id
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  return res.render("listings/show.ejs", { listing });
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);

  // owner
  newListing.owner = req.user._id;

  // cloudinary image
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();

  req.flash("success", "New listing created!");
  return res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  return res.render("listings/edit.ejs", { listing });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // if new image uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  return res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    req.flash("error", "Listing already deleted!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing deleted!");
  return res.redirect("/listings");
};