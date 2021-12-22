const Bootcamp = require('../model/bootcamp')
const path = require('path')
const ErrorResponse = require('../untils/errorResponse')
const geocoder = require('../untils/geocoder')
const asyncHandler = require('../Middleware/asynchandler')
// @desc Get all bootcamps
// @Routes Get /api/v1/bootcamps
// @acess public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
 
 })

// @desc Get Single bootcamps
// @Routes Get /api/v1/bootcamps/:id
// @acess Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    res.status(200).json({ sucess: true, data: bootcamp })
    if (!bootcamp) {
        // return res.status(400).json({success:false})
        next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 400))

    }
})

// @desc Create new bootcamp
// @Routes Post /api/v1/bootcamps
// @acess Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    req.body.user = req.user.id

    //check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user : req.user.id})

    if(publishedBootcamp && req.user.role != 'admin'){
        return next (new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400))
    }
    // console.log(req.body)
    const bootcamp = await Bootcamp.create(req.body)
    res.status(200).json({
        sucess: true,
        data: bootcamp
    })


})

// @desc Update bootcamp
// @Routes Put /api/v1/bootcamp/:id
// @acess Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        res.status(400).json({ success: false })
    }

    console.log(req.user)

if(bootcamp.user.toString() != req.user.id && req.user.role != 'admin'){
    return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to update bootcamp`, 401)
    )
}
bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
    new : true,
    runValidator : true,
})
    res.status(200).json({
        success: true,
        data: bootcamp
    });


})

// @desc Del bootcamp
// @Routes Delete /api/v1/bootcamp/:id
// @acess Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        res.status(400).json({ success: false })
    }
    bootcamp.remove()
    res.status(200).json({
        success: true,
        data: {}
    })
})

//map latitude and longitude
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude
    //earth radius
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng,lat], radius]}}
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,

    })
})


 //upload photo
 //@Routes put/api/v1/bootcamps/:id/photo

 exports.uploadPhoto = asyncHandler(async(req,res,next)=>{
  
    let bootcamp = await Bootcamp.findById(req.params.id);
 
    if(!bootcamp){
        return res.status(400).json({success:false})
    }
 

    if(!req.files){
        return next(new ErrorResponse(`plz upload a photo`,400))
    }
 
        const file = req.files.file
        console.log(file)

//file type
        if(!file.mimetype.startsWith('image'))
        {
            return next(new ErrorResponse(`plz uload pic file`,400))
        }
//file size
         if(file.size > process.env.MAX_FILE_UPLOAD)
        {
            return next(new ErrorResponse(`plz uload pic file less than ${process.env.MAX_FILE_UPLOAD}`,400))
        }

         // Create custom filename
   file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
       if (err)
       {
           console.error(err);
           return next(new ErrorResponse(`Problem with file upload`, 500));
       }

       await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

       res.status(200).json({
           success: true,
           data: file.name
       });
   });





    })