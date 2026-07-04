
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
app.engine("ejs",ejsMate)
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const listings=require("./routes/listings.js");
const reviews=require("./routes/review.js");

const port=8080;
//database
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
        console.log("database is connected")
}).catch((err)=>{
    console.log(err)
});
 async function  main(){
    await mongoose.connect(MONGO_URL);
 }
//DATABASE IS CONNECTED

app.get("/",(req,res)=>{
    res.send("web is working")
})



app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews)
   
 

// this is from gemini In exTra FuCtiOn

// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
    
//     // Redirect ki jagah JSON bhejein
//     res.json({ success: true, reviewId: reviewId });
// }));









// app.get("/testlisting",async(req,res)=>{
//     let testlisting= new Listing({
//         title:"My new village",
//         description:"buy the bitch",
//         price:1200,
//         location:"Calanguata, Goa",
//         county:"india",

//     })
//     testlisting.save();
//     console.log("sample was saved");
//     res.send("succesfull testing")
// })

// Catch-all for 404 pages (Express v5 friendly)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{err})
  //  res.status(statusCode).send(message)

})


app.listen(8080,()=>{
    console.log("server is working ")

})