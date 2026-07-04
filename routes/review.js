
const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Yeh line upar aayegi
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// Review route post
    
    router.post("/", validatereview, wrapAsync(async (req, res) => {
        const { id } = req.params; // <--- Yeh line add ki hai
        const listing = await Listing.findById(id);
        const newreview = new Review(req.body.review);
    
        listing.reviews.push(newreview);
    
        await newreview.save();
        await listing.save();
    
        console.log("save new review");
        res.redirect(`/listings/${id}`);
    }));


            


// Delete review route

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports=router;

