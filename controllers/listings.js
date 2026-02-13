const Listing= require("../models/listing");

module.exports.index= async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm= (req, res) => {
  
  res.render("listings/new.ejs");
}
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(req.params.id).populate({path:"reviews", populate:{path: "author"}}).populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {

    const newListing = new Listing(req.body.listing);

    // set owner
    newListing.owner = req.user._id;

    // set image from cloudinary
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}
module.exports.updateListing = async(req, res) => {
   let {id} =req.params;
  let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file){
  let url= req.file.path;
  let filename=req.file.filename;
  listing.image= {url, filename};
  await listing.save();
  }
    req.flash("success", "New listing updated!");
  res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
    req.flash("success", "listing deleted!");
  res.redirect("/listings");
}