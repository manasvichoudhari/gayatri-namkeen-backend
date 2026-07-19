const Cart = require("../models/Cart");
const mongoose = require("mongoose");


// ================= ADD TO CART =================

const addToCart = async (req, res) => {

  try {

    const {
      productName,
      price,
      image
    } = req.body;
    const userId = req.user._id;


    if(!userId || !productName || !price){

      return res.status(400).json({
        success:false,
        message:"Required fields missing"
      });

    }



    const existingItem = await Cart.findOne({

      userId,
      productName

    });



    if(existingItem){

      existingItem.quantity += 1;

      await existingItem.save();


      return res.status(200).json({

        success:true,
        message:"Cart updated successfully",
        cartItem:existingItem

      });

    }




    const cartItem = await Cart.create({

      userId,
      productName,
      price,
      image,
      quantity:1

    });



    res.status(201).json({

      success:true,
      message:"Item added to cart",
      cartItem

    });



  }catch(error){

    console.log(error);

    res.status(500).json({

      success:false,
      message:error.message

    });

  }

};





// ================= GET CART =================


const getCartItems = async(req,res)=>{


try{


const {userId}=req.params;



if(!mongoose.Types.ObjectId.isValid(userId)){

return res.status(400).json({

success:false,
message:"Invalid user id"

});

}




const items = await Cart.find({

  userId:req.user._id 

});



res.status(200).json({

success:true,
items

});



}catch(error){

console.log(error);


res.status(500).json({

success:false,
message:error.message

});


}


};






// ================= REMOVE ITEM =================



const removeCartItem = async(req,res)=>{


try{


const {id}=req.params;



if(!mongoose.Types.ObjectId.isValid(id)){

return res.status(400).json({

success:false,
message:"Invalid cart id"

});

}




const item = await Cart.findById(id);



if(!item){

return res.status(404).json({

success:false,
message:"Cart item not found"

});

}




await Cart.findByIdAndDelete(id);



res.status(200).json({

success:true,
message:"Item removed successfully"

});



}catch(error){


res.status(500).json({

success:false,
message:error.message

});


}


};







// ================= INCREASE =================



const increaseQuantity = async(req,res)=>{


try{


const item = await Cart.findById(req.params.id);



if(!item){

return res.status(404).json({

success:false,
message:"Cart item not found"

});

}




item.quantity += 1;


await item.save();



res.status(200).json({

success:true,
message:"Quantity increased",
item

});



}catch(error){


res.status(500).json({

success:false,
message:error.message

});


}


};







// ================= DECREASE =================



const decreaseQuantity = async(req,res)=>{


try{


const item = await Cart.findById(req.params.id);



if(!item){

return res.status(404).json({

success:false,
message:"Cart item not found"

});

}




if(item.quantity > 1){

item.quantity -= 1;

await item.save();

}




res.status(200).json({

success:true,
message:"Quantity decreased",
item

});



}catch(error){


res.status(500).json({

success:false,
message:error.message

});


}


};






// ================= CLEAR CART =================



const clearCart = async(req,res)=>{


try{


const {userId}=req.params;



await Cart.deleteMany({

  userId:req.user._id

});



res.status(200).json({

success:true,
message:"Cart cleared successfully"

});



}catch(error){


res.status(500).json({

success:false,
message:error.message

});


}


};





module.exports={

addToCart,
getCartItems,
removeCartItem,
increaseQuantity,
decreaseQuantity,
clearCart

};