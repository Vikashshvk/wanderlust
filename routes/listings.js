
const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
// database related
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const mongoose=require("mongoose");




const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Yeh line upar aayegi
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index route
router.get("/", wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", wrapAsync(async (req, res, next) => {
    console.log(req.body);
    let result = listingSchema.validate(req.body);
    console.log(result);
    
    if (result.error) {
        throw new ExpressError(404, result.error);
    }
    
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    console.log(listing);
    res.redirect("/listings");
}));

// create route end

//update route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { newListing });
    console.log(newListing);
}));

// router.put("/listings/:id",async(req,res)=>{
//     const {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect("/listings");
// }) 
router.put("/:id", wrapAsync( async (req, res) => {
    const { id } = req.params;
    let listing = req.body.listing;
    // Image ko object format mein convert karein
    listing.image = { url: listing.image, filename: "listingimage" }; 
    await Listing.findByIdAndUpdate(id, { ...listing });
    res.redirect(`/listings/${id}`);
}));



// Destroy route
router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}   
    )  )

    
    module.exports=router;