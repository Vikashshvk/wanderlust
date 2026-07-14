
const Listing=require("../models/listing.js");
const listingSchema = require("../schema.js"); // Jo bhi aapka joi schema path ho
const ExpressError = require("../utils/ExpressError.js"); // Jo bhi aapka error class path ho



module.exports.index=async(req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
}


module.exports.renderNewForm=(req, res) => {
         res.render("listings/new.ejs");         
}

module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
         req.flash("error","Your listing does not exist");
       return  res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async(req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
  
    let listing = req.body.listing;
    const newListing = new Listing(listing);

    //  console.log(newListing.owner)
    newListing.owner=req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    console.log(listing);
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
}
module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const newListing = await Listing.findById(id);
    req.flash("success", "Successfully updated");
    res.render("listings/edit.ejs", { newListing });
    console.log(newListing);
}

module.exports.updateListing= async (req, res) => {
    const { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
          console.log(req.file)
  if(typeof req.file !== "undefined"){ 
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename }
      await listing.save();
    }
    req.flash("success", "Successfully updated");

    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully listing Delete");
    res.redirect("/listings");
}   

