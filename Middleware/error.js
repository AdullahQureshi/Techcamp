const ErrorResponse = require('../untils/errorResponse')

const errorHandler =(err,req,res,next)=>{

    let error = {...err}
    error.message = err.message
    console.log(err.stack.cyan.america.bold)
//bad object id
    if(err.name === "CastError"){
        const message = `Bootcamp not found with id of ${err.value}`
        error = new ErrorResponse(message,400)
    }

    //duplicate 
        if(err.code===11000){
            const message = `Duplicated bootcamp`
            error = new ErrorResponse(message,400)
        }

        //mongoose empty field error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val=> val.message)
            error = new ErrorResponse(message,400)
            
        }
    res.status(res.statusCode || 500).json({success:false, error:error.message || 'Server error' })
}



module.exports = errorHandler


