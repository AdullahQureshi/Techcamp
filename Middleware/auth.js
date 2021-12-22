const jwt = require('jsonwebtoken')
const asyncHandler = require('./asynchandler')
const ErrorResponse = require('../untils/errorResponse')
const User = require('../model/user')


exports.protect = asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
         )
         {
             //set token from bearer token in header
             token = req.headers.authorization.split(' ')[1];

         }
         else if (req.cookies.token)
         {
             token = req.cookies.token;
         }
      

         if(!token)
         {
             return next(new ErrorResponse('Not authorize to access these route',401))
         }
         try{
             const decoded = jwt.verify(token , process.env.JWT_SECRET);
             console.log(decoded,'decoded')
             req.user = await User.findById(decoded.id);
             next()
         }
         catch(err){
            return next(new ErrorResponse('Not authorize to access these route',401))

         }
})

exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorize to access this role`,403
                )
            );
        }
        next();
    };
}