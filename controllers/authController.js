const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const transporter = require("../config/mail");


// ================= REGISTER =================

exports.registerUser = async (req, res) => {

  try {

    const { name, email, phone, password } = req.body;


    if (!name || !email || !password) {

      return res.status(400).json({
        success:false,
        message:"Name, email and password are required"
      });

    }


    const cleanEmail = email.trim().toLowerCase();


    const userExists = await User.findOne({
      email:cleanEmail
    });


    if(userExists){

      return res.status(400).json({
        success:false,
        message:"User already exists"
      });

    }


    const hashedPassword = await bcrypt.hash(password,10);



    const user = await User.create({

      name:name.trim(),
      email:cleanEmail,
      phone,
      password:hashedPassword

    });



    res.status(201).json({

      success:true,

      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        role:user.role
      },

      token:generateToken(user._id)

    });


  } catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};



// ================= LOGIN =================


exports.loginUser = async(req,res)=>{


try{


const {email,password}=req.body;


if(!email || !password){

return res.status(400).json({

success:false,
message:"Email and password required"

});

}



const user = await User.findOne({

email:email.trim().toLowerCase()

});



if(!user){

return res.status(400).json({

success:false,
message:"Invalid email or password"

});

}



// BLOCK CHECK

if(user.isBlocked){

return res.status(403).json({

success:false,
message:"Your account is blocked by admin"

});

}




const match = await bcrypt.compare(
password,
user.password
);



if(!match){

return res.status(400).json({

success:false,
message:"Invalid email or password"

});

}



res.status(200).json({

success:true,

user:{

_id:user._id,
name:user.name,
email:user.email,
phone:user.phone,
role:user.role

},

token:generateToken(user._id)

});



}catch(error){


console.log(error);


res.status(500).json({

success:false,
message:error.message

});


}


};





// ================= FORGOT PASSWORD =================


exports.forgotPassword = async(req,res)=>{


try{


const {email}=req.body;


if(!email){

return res.status(400).json({

success:false,
message:"Email required"

});

}



const user = await User.findOne({

email:email.trim().toLowerCase()

});



if(!user){

return res.status(404).json({

success:false,
message:"User not found"

});

}




const resetToken = crypto
.randomBytes(32)
.toString("hex");



const hashedToken = crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");



user.resetPasswordToken = hashedToken;

user.resetPasswordExpire =
Date.now()+15*60*1000;



await user.save();




// IMPORTANT FOR DEPLOYMENT

const resetLink =
`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;



try{


await transporter.sendMail({

from:process.env.EMAIL,

to:user.email,

subject:"Reset Your Password",

html:`

<h2>Hello ${user.name}</h2>

<p>You requested password reset.</p>

<a href="${resetLink}"
style="
background:#ff6b00;
color:white;
padding:12px 20px;
border-radius:5px;
text-decoration:none;
">

Reset Password

</a>


<p>This link expires in 15 minutes.</p>

`

});



res.status(200).json({

success:true,

message:"Password reset link sent"

});



}catch(mailError){



user.resetPasswordToken=null;

user.resetPasswordExpire=null;

await user.save();



console.log(mailError);



res.status(500).json({

success:false,

message:"Email sending failed"

});


}




}catch(error){


console.log(error);


res.status(500).json({

success:false,
message:error.message

});


}


};





// ================= RESET PASSWORD =================



exports.resetPassword = async(req,res)=>{


try{


const {token}=req.params;

const {password}=req.body;



if(!password){

return res.status(400).json({

success:false,
message:"Password required"

});

}




const hashedToken = crypto
.createHash("sha256")
.update(token)
.digest("hex");





const user = await User.findOne({

resetPasswordToken:hashedToken,

resetPasswordExpire:{
$gt:Date.now()
}

});




if(!user){

return res.status(400).json({

success:false,
message:"Invalid or expired token"

});

}




user.password =
await bcrypt.hash(password,10);


user.resetPasswordToken=null;

user.resetPasswordExpire=null;



await user.save();




res.status(200).json({

success:true,

message:"Password updated successfully"

});




}catch(error){


console.log(error);


res.status(500).json({

success:false,
message:error.message

});


}


};