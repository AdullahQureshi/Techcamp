const express = require('express')
const router = express.Router({mergeParams: true})



const {getCourses, singleCourse , addCourse, updateCourse , deleteCourse } = require('../Controllers/course')

router.route('/')
.get(getCourses)
.post(addCourse)


router.route('/:id')
.get(singleCourse)
.put(updateCourse)
.delete(deleteCourse)
// .put(uploadPhoto)






module.exports = router