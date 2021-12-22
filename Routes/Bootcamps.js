const express = require('express')
const router = express.Router()

const Bootcamps = require('../model/bootcamp')




const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, uploadPhoto } = require('../Controllers/Bootcamps')

const courseRouter = require('./course')
const reviewRouter = require('./reviews');
const { protect, authorize } = require('../Middleware/auth')
const advancedResults = require('../Middleware/advancedResults')
router.use('/:bootcampId/reviews', reviewRouter);
router.use('/:bootcampId/course', courseRouter)

router.route('/')
    .get(advancedResults(Bootcamps, 'courses'), getBootcamps)
    .post(protect, authorize("publisher", "admin"), createBootcamp)


router.route('/:id')
    .get(getBootcamp)
    .put(protect,authorize ("publisher", "admin"), updateBootcamp)
    .delete(protect, authorize("publisher", "admin"), deleteBootcamp)

router.route('/:id/photo')
    .put(protect, authorize("publisher", "admin"), uploadPhoto)

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)


module.exports = router