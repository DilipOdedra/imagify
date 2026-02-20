// import userModel from "../models/userModel.js";
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'

// export const registerUser= async (req,res)=>{
//     try{
//         const {name,email,password}=req.body;
//         if(!name || !email || !password){
//             return res.json({success:false,message:'Missing Details'});
//         }

//         const salt=await bcrypt.genSalt(10);
//         const hashedPassword=await bcrypt.hash(password,salt);

//         const userData={
//             name,email,password:hashedPassword
//         }

//         const newUser=new userModel(userData);
//         const user=await newUser.save();

//         const token=jwt.sign({id:user._id},process.env.JWT_SECRET)

//         res.json({success:true,token,user:{name: user.name}})


//     }catch(error){
//         console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// export const loginUser=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         const user=await userModel.findOne({email});

//         if(!user){
//             return res.json({success:false,message:"User does not exist"});
//         }

//         const isMatch=await bcrypt.compare(password,user.password);

//         if(isMatch){
            
//         const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
//         res.json({success:true,token,user:{name: user.name}})


//         }else{
//             return res.json({success:false,message:"Invalid credentials"});
//         }

//     }catch(error){
//          console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

// export const userCredits=async(req,res)=>{
//     try{
//         const {userId}=req.body;

//         const user=await userModel.findById(userId);
//         res.json({success:true,credits:user.creditBalance,user:{name:user.name}})
//     }catch(error){
//         console.log(error.message);
//         res.json({success:false,message:error.message});
//     }
// }

import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ================= REGISTER USER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing details",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= LOGIN USER ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= USER CREDITS ================= */
export const userCredits = async (req, res) => {
  try {
    const  userId  = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
