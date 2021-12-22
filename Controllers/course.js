
const Course = require('../model/Course')
const Bootcamp = require('../model/bootcamp')    
const asyncHandler = require('../Middleware/asynchandler')
const ErrorResponse = require('../untils/errorResponse')





// exports.courseBootcamp = asyncHandler(async (req, res, next) => {
//     const courses = await Course.find()
//     res.status(200).json({ sucess: true, data: courses })
//     if (!courses) {
       
//         next(new ErrorResponse(`courses not found `, 400))
//     }
//  }) 



 exports.singleCourse = asyncHandler(async (req, res, next) => {
         const courses = await Course.findById(req.params.id)
         .populate({
             path:"bootcamp",
             select:"name description"
         })
    res.status(200).json({ sucess: true, data: courses })

    if (!courses) {
       
        next(new ErrorResponse(`courses not found `, 400))
    } 
   
 }) 
 

 exports.getCourses = asyncHandler(async (req, res, next) => {
     let query;

     if (req.params.bootcampId)
     {
        query= Course.find({bootcamp : req.params.bootcampId})
        console.log("if working")
     }
     
     else 
     {  
         query = Course.find().populate({
             path:"bootcamp",
             select:"name description"
         })
        console.log("else working")
        
     }
     const courses = await query
    res.status(200).json({ sucess: true,count:courses.length, data: courses })


}) 


//addcourse
//courses:id
exports.addCourse = asyncHandler(async(req,res,next)=>{
    req.body.bootcamp = req.params.bootcampId;
    req.body.user= req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp)
    {
        return next( new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`,404)
        )
    }


    //make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin')
    {
        return next( new ErrorResponse(`No authorize to add a course ${bootcamp.id}`,404)
        )
    }
    const course = await Course.create(req.body)
    res.status(200).json({ sucess: true,count:course.length, data: course })

    
})


exports.updateCourse = asyncHandler(async(req,res,next)=>{
  
   let course = await Course.findById(req.params.id);

   if(!course)
   {
       return next(
       new ErrorResponse(`No Course with id of ${req.params.id}`,404)

       );
   }

   //make sure User is course owner
   if(course.user.toString() !== req.user.id && req.user.role !== 'admin')
   {
    return next( new ErrorResponse(`No authorize to add a course ${bootcamp.id}`,404)
    )
   }

      course = await Course.findByIdAndUpdate(req.params.id, req.body,{
          new:true,
          runValidator:true,
      })


    res.status(200).json({ sucess: true,count:course.length, data: course })

    
})


exports.deleteCourse = asyncHandler(async(req,res,next)=>{
  
    let course = await Course.findById(req.params.id);
 
    if(!course)
    {
        return next(
        new ErrorResponse(`No Course with id of ${req.params.bootcampId}`,404)
 
        );
    }

    //
      //make sure User is course owner
   if(course.user.toString() !== req.user.id && req.user.role !== 'admin')
   {
    return next( new ErrorResponse(`user ${req.user.id} is not authorize to delete ${course._id}` ,401)
    )
   }
 
           await course.remove()
 
 
     res.status(200).json({ sucess: true,count:course.length, data: {} 
    });
 
     
 })


