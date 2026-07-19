const Order = require("../models/Order");

const {
 sendAdminOrderEmail,
 sendCustomerOrderEmail,
} = require("../services/emailService");



exports.createOrder = async(req,res)=>{

try{


const order = await Order.create({

 userId:req.body.userId,

 items:req.body.items,

 totalAmount:req.body.totalAmount,

 paymentMethod:req.body.paymentMethod,

 paymentStatus:req.body.paymentStatus || "PENDING",

 paymentId:req.body.paymentId || null,

 address:req.body.address

});



try{

await sendAdminOrderEmail(order);

}
catch(err){

console.log(
"Admin Email Error:",
err.message
);

}



try{

await sendCustomerOrderEmail(order);

}
catch(err){

console.log(
"Customer Email Error:",
err.message
);

}



res.status(201).json({

success:true,

message:"Order Placed Successfully",

order

});


}
catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};




exports.getUserOrders = async(req,res)=>{

try{


const orders = await Order.find({

userId:req.params.userId

})
.sort({
createdAt:-1
});



res.json(orders);



}
catch(err){

res.status(500).json({

message:err.message

});

}


};