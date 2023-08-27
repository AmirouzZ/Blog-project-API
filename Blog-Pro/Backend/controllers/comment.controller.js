
const asyncHandler = require('express-async-handler')

const {Comment, commentCrateValidate, commentUpdateValidate} = require('../model/Comment')
const { Post } = require('../model/Post')
const { User } = require('../model/User.model')
/**
 * @desc create new comment  
 * @route /api/comment
 * @method post
 * @access private only logged in user
 */

const createComment = asyncHandler(async(req, res) => {
    const { error } = commentCrateValidate(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    const post = await Post.findById(req.body.postId)
    if(!post){
        return res.status(404).json('Post Not Found')
    }
    const profile = await User.findById(req.user.id)
    const comment = new Comment({
        postId: req.body.postId,
        text: req.body.text,
        user: req.user.id,
        username: profile.username
    })
    await comment.save()
    res.status(201).json(comment)
})

/**
 * @desc get all comments  
 * @route /api/comment
 * @method get
 * @access private only logged in user
 */

const getAllComments = asyncHandler(async(req, res) => {
    const comments = await Comment.find().populate('user', ['-password'])
    if(!comments.length){
        return res.status(404).json({message: "No Comments Found"})
    }
    res.status(200).json(comments)
})

/**
 * @desc delete comment
 * @route /api/comment/:id
 * @method delete
 * @access private only owner of comment or admin or owner of the post
 */

const deleteComment = asyncHandler(async(req, res) => {
    const comment = await Comment.findById(req.params.id)
    if(!comment){
        return res.status(404).json({message: "Comment Not Found"})
    }
    const post = await Post.findById(comment.postId)
    if(!post){
        return res.status(404).json({message: "Post Not Found"})
    }
    if(req.user.isAdmin || req.user.id === comment.user.toString() || req.user.id === post.user.toString()){
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({message: 'Comment has been been deleted successfully'})
    } else {
        res.status(403).json({message: "access denied, only admin or owner of post is allowed"})
    }
})

/**
 * @desc update comment
 * @route /api/comment/:id
 * @method put
 * @access private only owner of comment
 */

const updateComment = asyncHandler(async(req, res) => {
    const { error } = commentUpdateValidate(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    let comment = await Comment.findById(req.params.id)
    if(!comment){
        return res.status(404).json({message: 'Comment Not Found'})
    }
    if(req.user.id === comment.user.toString()){
    comment = await Comment.findByIdAndUpdate(req.params.id, req.body,{new: true})
    res.status(201).json(comment)
    } else {
        res.status(403)
        .json({message: "access denied, only owner of comment is allowed"})
    }
})

module.exports = {
    createComment,
    getAllComments,
    deleteComment,
    updateComment
}
