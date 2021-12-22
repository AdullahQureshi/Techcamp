const express = require('express');
const {
   getUsers,
   getUser,
   createUser,
   updateUser,
   deleteUser
} = require('../controllers/user');

const User = require('../model/user');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../Middleware/advancedResults')
const { protect, authorize } = require('../Middleware/auth');

router.use(protect);
router.use(authorize('admin'));



router.route('/')
   .get(advancedResults(User), getUsers)
   .post(createUser);

router.route('/:id')
   .get(getUser)
   .put(updateUser)
   .delete(deleteUser);

module.exports = router;