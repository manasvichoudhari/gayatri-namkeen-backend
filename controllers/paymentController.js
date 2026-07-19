const razorpay = require("../config/razorpay");
const crypto = require("crypto");



const createOrder = async(req,res)=>{

try{

const {amount}=req.body;


if(!amount){
return res.status(400).json({
success:false,
message:"Amount required"
});
}



const options={

amount:Number(amount)*100,

currency:"INR",

receipt:`receipt_${Date.now()}`

};



const order = await razorpay.orders.create(options);



res.status(200).json(order);



}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:"Failed to create Razorpay Order"

});

}

};





const verifyPayment = async(req,res)=>{


try{


const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature
}=req.body;



const sign =
razorpay_order_id+"|"+razorpay_payment_id;



const expectedSign =
crypto
.createHmac(
"sha256",
process.env.RAZORPAY_KEY_SECRET
)
.update(sign)
.digest("hex");



if(expectedSign===razorpay_signature){


return res.json({

success:true,

message:"Payment Verified",

paymentId:razorpay_payment_id,

orderId:razorpay_order_id

});


}



res.status(400).json({

success:false,

message:"Invalid Signature"

});



}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}


};



module.exports={
createOrder,
verifyPayment
};