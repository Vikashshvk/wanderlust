
const express = require("express");
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}



module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new user({ email, username });
        const registerUser = await user.register(newuser, password);
        console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wandurlust!");
            // res.redirect(res.locals.redirectUrl);
            let redirectUrl = res.locals.redirectUrl || "/listings"; 
            res.redirect(redirectUrl);
            //  res.redirect(res.locals.redirectUrl); 
        } )
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
}


 




