// const dns = require("dns");
// dns.setServers(["1.1.1.1", "8.8.8.8"]);

// if(process.env.NODE_ENV !== "production"){
//     require("dotenv").config();
// }
if (process.env.NODE_ENV !== "production") {
    const dns = require("dns");
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models aur Routes Imports
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");

// All Router
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 8080;

const MONGO_URL = process.env.ATLASDB_URL;

// Database Connection
main().then(() => { 
    console.log("database is connected");   
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// View Engine & Parser Middlewares
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Latest MongoStore format (No crash)
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("session store error", err);
});

store.on("error", (err) => {
    console.log("session store error", err);
});

// Session Configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
// Global Middlewares (Session, Flash & Passport)
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser= req.user
    next();
});

// --- ROUTES ---

// Root Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Demo User Route (With wrapAsync)
// app.get("/demouser", wrapAsync(async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     console.log(registeredUser);
//     res.send(registeredUser);
// }));

// Router Middlewares
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/user", userRouter)

// --- ERROR HANDLING ---

// Catch-all 404
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Generic Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// Server Listen
app.listen(port, () => {
    console.log(`server is working on port ${port}`);
});