const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

productName:{
type:String,
required:true
},

price:{
type:Number,
required:true
},

image:{
type:String
},

quantity:{
type:Number,
default:1,
min:1
}


},{timestamps:true});


module.exports = mongoose.model("Cart",cartSchema);