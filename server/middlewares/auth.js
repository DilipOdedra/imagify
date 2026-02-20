// import jwt from 'jsonwebtoken';

// const userAuth=async(req,res,next) =>{
//     // const {token}=req.headers;
//     const authHeader = req.headers.authorization;
// const token = authHeader && authHeader.split(" ")[1];


//     if(!token){
//         return res.json({success:false,message:'Not Authorized.Login Again'});
//     }

//     try{
//         const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);

//         if(tokenDecode.id){
//         //    req.body.userId = tokenDecode.id; 
//         req.userId = tokenDecode.id;

//         }else{
//             // return res.json({success:false,message:'Not Authorized. Login Again'});
//             return res.status(401).json({ success: false, message: "Not Authorized" });

//         }

//         next();
//     }catch(error){
//         // return  res.json({success:true,message:error.message});
//         return res.status(401).json({ success: false, message: "Invalid token" });

//     }
// }

// export default userAuth;

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header existence and format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, invalid token",
      });
    }

    // Attach userId to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token expired or invalid",
    });
  }
};

export default userAuth;
