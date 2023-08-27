

const fs = require('fs')
const path = require('path')
const asyncHandler = require('express-async-handler')

const { Comment } = require('../model/Comment')
const { User } = require('../model/User.model')
const { Post, postCreateValidation, postUpdateValidation } = require('../model/Post')

/**
 * @desc create post
 * @route /api/posts
 * @method post
 * @access private only logged in user
 * 
 */

const createPost = asyncHandler(async(req, res) => {
    // 1. validate image
    if(!req.file){
        return res.status(400).json({message: 'No image provided'})
    }
    // 2. validate data
    const { error } = postCreateValidation(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    // 3. upload photo @ TODO (vid 11)

    // 4. create post and save it to db
//------------------------------    
    // const post = new Post({
    //     title: req.body.title
    // })
    // await post.save()
//-------------------------------

    // OR 
    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        categorey: req.body.categorey,
        user: req.user.id,
        image: {
            url: "",
            //publicId: , 
        }
    })
    /* add postid to user model
const user = await User.findById(post.user)
    await User.findByIdAndUpdate(post.user, {
        $push: {
            posts: post._id
        }
    })
 */ 

    // 5. send response
    res.status(201).json(post)
    // 6. delete img from server

})

/**
 * @desc get posts
 * @route /api/posts
 * @method get
 * @access private public
 * 
 */

const getAllPosts = asyncHandler(async(req, res) => {
    const {categorey, pageNumber} = req.query
    const postsPerPage = 3
    let posts;
    
    if(pageNumber){
        posts = await Post.find()
        .skip((pageNumber - 1) * postsPerPage)
        .limit(postsPerPage)
        .sort({createdAt: -1})
        .populate('user', ['-password']).populate('comments')
    }
    else if(categorey){
        posts = await Post.find({categorey: categorey})
        .sort({createdAt: -1})
        .populate('user', ['-password']).populate('comments')
    } 
    else if(categorey && pageNumber){
        posts = await Post.find({categorey: categorey})
        .skip((pageNumber - 1) * postsPerPage)
        .limit(postsPerPage)
    } 
    else {
        posts = await Post.find()
        .sort({createdAt: -1})
        .populate('user', ['-password']).populate('comments')
    }

    if(!posts.length){
        return res.status(404).json({message: "NO Posts Found"})
    }

    res.status(200).json(posts)
})


/**
 * @desc get single post
 * @route /api/posts/:id
 * @method get
 * @access private public
 */

const getSinglePost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id)
    .populate('user', ['-password']).populate('comments')
    if(!post){
        return res.status(404).json({message: 'Post Not Found'})
    }
    res.status(200).json(post)
})


/**
 * @desc get posts count
 * @route /api/posts/count
 * @method get
 * @access private public
 */

const getPostsCount = asyncHandler(async(req, res) => {
    const postsCount = await Post.count()
    res.status(200).json(postsCount)
})

/**
 * @desc delete post
 * @route /api/posts/:id
 * @method delete
 * @access private only admin or owner of post
 */

const deletePost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message: "Post Not Found"})
    }
    if(req.user.isAdmin || req.user.id === post.user.toString())
    {
    await Post.findByIdAndDelete(req.params.id)
    // @TODO delete photo from cloud
    // @TODO delete all comments on post
    const comments = await Comment.find({postId: post._id})
    if(!comments.length){
        return res.status(404).json({message: 'No comments belog to this post'})
    }
    await Comment.deleteMany({postId: post._id})
    return res.status(200).json({message: "Post Has Been Deleted Successfully", postId: post._id})
} 
    res.status(403).json({message: 'Only Admin or Owner of Post Allowed'})
})

/**
 * @desc update post
 * @route /api/posts/:id
 * @method put
 * @access private only owner of post
 */

const updatePost = asyncHandler(async(req, res) => {
    const {error} = postUpdateValidation(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    const post = await Post.findById(req.params.id)
    if(!post){
        return res.status(404).json({message: "Post Not Found"})
    }
    if(req.user.id !== post.user.toString()){
        return res.status(403).json({message: "Only Owner of Post Allowed"})
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('user', ['-password'])
    res.status(200).json(updatedPost)
})

// @TODO update photo of post  --vid 14.

/**
 * @desc toggle like 
 * @route /api/posts/like/:id
 * @method put
 * @access private only logged in user
 */

const toggleLike = asyncHandler(async(req, res) => {
    const { id: postId } = req.params
    let post = await Post.findById(postId)
    if(!post){
        return res.status(404).json({message: "Post Not Found"})
    }

    const isAlredyLiked = post.likes.find(id => id.toString() === req.user.id)
    if(isAlredyLiked){
        // post.likes.pull(isAlredyLiked)
        // await post.save()
        post = await Post.findByIdAndUpdate(postId, {
            $pull: {
                likes: req.user.id
            }
        }, {new: true})
    } else {
        // post.likes.push(req.user.id)
        // await post.save()
        post = await Post.findByIdAndUpdate(postId, {
            $push: {
                likes: req.user.id
            }
        }, {new: true})
    }
    res.status(200).json(post)
})



module.exports = {
    createPost, 
    getAllPosts, 
    getSinglePost, 
    getPostsCount, 
    deletePost,
    updatePost,
    toggleLike
}
