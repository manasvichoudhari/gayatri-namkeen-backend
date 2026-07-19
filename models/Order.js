const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(

{

userId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"User",
 required:true
},


items:[

{

productName:{
 type:String,
 required:true
},

price:{
 type:Number,
 required:true
},

quantity:{
 type:Number,
 required:true
},

weight:String,

image:String

}

],



address:{

name:String,

email:String,

phone:String,

address:String,

city:String,

state:String,

pincode:String

},



totalAmount:{
type:Number,
required:true
},



paymentMethod:{

type:String,

enum:["COD","ONLINE"],

default:"COD"

},



paymentStatus:{

type:String,

enum:["PAID","PENDING","FAILED"],

default:"PENDING"

},



paymentId:{
type:String,
default:null
},



orderStatus:{

type:String,

enum:[
"PLACED",
"CONFIRMED",
"PACKED",
"SHIPPED",
"DELIVERED"
],

default:"PLACED"

}


},

{
timestamps:true
}

);



module.exports = mongoose.model("Order",orderSchema);