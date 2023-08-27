const { User, userUpdateValidation } = require('../model/User.model')
const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const { Post } = require('../model/Post')
const { Comment } = require('../model/Comment')


/**
 * @desc get all users profile
 * @route /api/users/profile/:id
 * @method GET
 * @access private (only admin)
 * 
 */

const  getAllUsers = asyncHandler(async ( req, res) => {
    const users = await User.find().select("-password")
    if(!users){
        return res.status(404).json({message: "No users Found"})
    }
    res.status(200).json({users})
})


/**
 * @desc get user profile by id
 * @route /api/users/profile/:id
 * @method GET
 * @access private (only admin)
 * 
 */

const getUserById = asyncHandler(async(req, res) => {
    let user = await User.findById(req.params.id).select("-password").populate('posts')
    if(!user){
        return res.status(404).json({message: "User Not Found"})
    }
    res.status(200).json(user)
})



/**
 * @desc update user profile by id
 * @route /api/users/profile/:id
 * @method PUT
 * @access private (only user himself)
 * 
 */

const updateUserProfile = asyncHandler(async(req, res) => {
    const { error } = userUpdateValidation(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    let user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({message: "User Not Found"})
    }
    if(req.body.password){
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    user = await User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
    }, {
        new: true
    }).select("-password")  

    res.status(200).json(user)  
})



/**
 * @desc get users count
 * @route /api/users/count
 * @method GET
 * @access private (only admin)
 * 
 */

const getUsersCount = asyncHandler(async(req, res) => {
    const usersCount = await User.count()
    res.status(200).json({message: usersCount})
})



/**
 * @desc profile photo upload
 * @route /api/users/profile/photo-upload
 * @method POST
 * @access private only user who already logged in
 * 
 */

const profilePhotoUpload = asyncHandler(async(req, res) => {
    console.log(req.file)
    if(!req.file){
        return res.status(400).json({message: "No File Provided"})
    }

    res.status(200).json({message: "your profile photo has been uploaded successfully"})
})


/**
 * @desc delete user profile
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private only admin or user himself
 * 
 */

const userProfileDelete = asyncHandler(async(req, res) => {
    /**
     * 1. get user frmo db
    */ 
    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({message: "User Not Found"})
    }
    // 2. get all posts from db (todo)
    // const posts = await Post.find({user: req.params.id})
    // if(!posts.length){
    //     return res.status(404).json({message: "No posts belong to this user"})
    // }
     // 3. get public ids from posts  (todo)
     // 4. delete images belong to user from cloudinary (todo)
     
     // 5. delete profile photo from cloudinary 

    // 6. delete user posts & comments
    await Post.deleteMany({user: req.params.id})  // user: user._id
    await Comment.deleteMany({user: req.params.id})

    // 7. delete user himself
    await User.findByIdAndDelete(req.params.id)
    // 8- send response
    res.status(200).json({message: "Profile has bees deleted successfully"})
    
    

})


module.exports = {
    getAllUsers,
    getUserById, 
    updateUserProfile, 
    getUsersCount,
    profilePhotoUpload,
    userProfileDelete
}
