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
   initData.data=initData.data.map((obj)=>({
            ...obj,owner:"6a4aa08a809e155f81d5531d"
     }))
    await Listing.insertMany(initData.data);
    console.log("init data")     
}

initDB();
