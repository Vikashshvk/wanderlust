const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})
const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
// const ExpressError=require("../utils/ExpressError.js")
// const {listingSchema,reviewSchema}=require("../schema.js")
// database related

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const mongoose=require("mongoose");
const { isLoggedin,isOwner,validatelisting,validatereview} = require("../middleware.js");

//controllers
const listingController=require("../constrollers/listings.js")


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,validatelisting,upload.single("listing[image]"), wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedin,listingController.renderNewForm);



//show route
router.get("/:id",wrapAsync(listingController.showListing));




//update route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));

router.put("/:id",isLoggedin,isOwner,upload.single("listing[image]"),validatelisting ,wrapAsync(listingController.updateListing));
// Destroy route
router.delete("/:id",isLoggedin,isOwner, wrapAsync(listingController.deleteListing))
    module.exports=router;