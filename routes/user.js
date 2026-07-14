const express = require("express");
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../constrollers/users.js")


const router = express.Router()
.get("/signup",userController.renderSignupForm)
.post("/signup",saveRedirectUrl,wrapAsync(userController.signup));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// LOGIN ROUTE FIX: Bracket aur Comma sahi kiya hai
router.post("/login",passport.authenticate("local", {
        failureRedirect: "/user/login",
        failureFlash: true, },userController.login),async(req,res) => {
        req.flash("success", "Welcome back to Wanderlust!");
      let redirectUrl = res.locals.redirectUrl || "/listings"; 
       res.redirect(redirectUrl);
    }
);

router.get("/logout",(req, res, next) => {
        req.logout((err) => {
if (err) { 
    return next(err);
}});
req.flash("success", "you are logged out!");
res.redirect("/listings");
})


module.exports = router;

