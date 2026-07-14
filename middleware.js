

const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
const wrapAsync=require("./utils/wrapAsync.js")
const Review=require("./models/review.js");


const Listing=require("./models/listing")



// kya user loggein hai is route pe iske liye 
module.exports.isLoggedin=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to listing")
    return    res.redirect("/user/login")
    }
    next();
}
module.exports.saveRedirectUrl= (req, res, next) => {
if (req.session.redirectUrl) {
   res.locals.redirectUrl = req.session.redirectUrl;
}
next()
}

module.exports.isOwner= async(req,res,next)=>{
    const { id } = req.params;
    const newListing = await Listing.findById(id);
   if(!newListing.owner.equals(res.locals.curUser._id)) { 
      req.flash("error","You dont have to permission to update or Delete this listing")
       return res.redirect(`/listings/${id}`)

     }
  next();
}

module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Yeh line upar aayegi
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    } 
};




module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    let review = await Review.findById(reviewId); 
    // Safe check: Agar review exist na karta ho
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    // FIX: curUser ki spelling sahi karein (single 'r')
    if (!review.author.equals(res.locals.curUser._id)) { 
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};

// Listing validation middleware jo missing tha
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
