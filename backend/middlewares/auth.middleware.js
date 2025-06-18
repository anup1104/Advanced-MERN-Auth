import jwt from "jsonwebtoken"
export const verifyToken = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token)return res.status(401).json({
        success:false,
        message:"Token not provided!"
    });
    try{
        
        const decode =  jwt.verify(token, process.env.JWT_SECRET)
        if(!decode)return res.status(401).json({
            success:false,
            message:"You are authenticated user!"
        })
        req.userId = decode.userId;
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error!"
        })
    }
}