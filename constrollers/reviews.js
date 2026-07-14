
 const Listing=require("../models/listing")
 const Review=require("../models/review")

const express=require("express")

module.exports.createReview=async (req, res) => {
        const { id } = req.params; // <--- Yeh line add ki hai
        const listing = await Listing.findById(id);
        const newreview = new Review(req.body.review);
              newreview.author=req.user._id
        listing.reviews.push(newreview);
    
        await newreview.save();
        await listing.save();
    
        console.log("save new review");
        req.flash("success", "Successfully made a new review");
        res.redirect(`/listings/${id}`);
    }

module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully review Delete");
    res.redirect(`/listings/${id}`);
}