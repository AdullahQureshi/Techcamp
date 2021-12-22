 const ErrorResponse = require('../untils/errorResponse')
 const asynchandler = require('../Middleware/asynchandler')
 const User = require('../model/user')
 
 


 //get all routes
//  get/api/v1/users

exports.getUsers = asynchandler(async(req,res,next)=>{
    res.status(200).json(res.advancedResults)
})

//get single user
//get api/v1/users :id

exports.getUser = asynchandler(async(req,res,next)=>{
          const user = await User.findById(req.params.id);
    res.status(200).json({success:true, data:user})

})

//cretae user
// /post api/v1/users
exports.createUser = asynchandler(async(req,res,next)=>{
    const user = await User.create(req.body);
res.status(200).json({success:true, data:user})

})


// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin


exports.updateUser = asynchandler(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
        
    });
res.status(200).json({success:true, data:user})

})


// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asynchandler(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
res.status(200).json({success:true, data:{} })
})


    