const {  
        getUserById, 
        updateUserProfile, 
        getUsersCount, 
        profilePhotoUpload, 
        userProfileDelete,
    } = require('../controllers/user.controller')

const userctrl = require('../controllers/user.controller')
const { objectIdValidate } = require('../MiddleWares/objectIdValidate')
const { photoUploader } = require('../MiddleWares/photoUpload')
const { isAdmin, onlyUser, adminOrUserHimself, verifyToken } = require('../MiddleWares/verifyToken')

const router = require('express').Router()

console.log(typeof(getAllUsers), 2)

router
.route('/profile/photo-upload')
.post(verifyToken, photoUploader.single('image'),profilePhotoUpload)

router
.route('/profile')
.get(isAdmin, userctrl.getAllUsers)

router
.route('/profile/:id')
.get(isAdmin, objectIdValidate, getUserById)
.put(onlyUser, objectIdValidate, updateUserProfile)
.delete(adminOrUserHimself, objectIdValidate, userProfileDelete)

router
.route('/count')
.get(isAdmin, getUsersCount)


module.exports = router
