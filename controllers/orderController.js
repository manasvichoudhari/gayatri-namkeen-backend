const Order = require("../models/Order");

const {
  sendAdminOrderEmail,
  sendCustomerOrderEmail,
} = require("../services/emailService");



// CREATE ORDER
console.log("req.user:", req.user);

console.log(
  "req.body:",
  JSON.stringify(req.body, null, 2)
);
console.log("Inside createOrder req.user:", req.user);
exports.createOrder = async (req, res) => {

  try {
    console.log("req.user =", req.user);
    console.log("req.body =", req.body);


    const order = await Order.create({

      userId: req.user._id,

      items: req.body.items,

      totalAmount: req.body.totalAmount,

      paymentMethod: req.body.paymentMethod,

      paymentStatus:
        req.body.paymentStatus || "PENDING",

      paymentId:
        req.body.paymentId || null,

      address: req.body.address,

    });



    res.status(201).json({

      success:true,

      message:"Order Placed Successfully",

      order,

    });




    // background emails

    sendAdminOrderEmail(order)

    .then(()=>console.log("Admin mail sent"))

    .catch(err =>
      console.log(
        "Admin Mail Error:",
        err.message
      )
    );




    sendCustomerOrderEmail(order)

    .then(()=>console.log("Customer mail sent"))

    .catch(err =>
      console.log(
        "Customer Mail Error:",
        err.message
      )
    );



  } catch (err) {
    console.error(err);
  
    if (err.name === "ValidationError") {
      console.error(err.errors);
    }
  
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }


  


};





// GET USER ORDERS

exports.getUserOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });


    res.status(200).json({
      success:true,
      orders,
    });


  } catch (err) {

    res.status(500).json({
      success:false,
      message:err.message,
    });

  }
};