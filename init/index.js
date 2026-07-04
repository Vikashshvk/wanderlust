const express=require("express")
const initData=require("./data.js")


//database
const Listing=require("../models/listing.js");
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

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("init data")
}

initDB();
