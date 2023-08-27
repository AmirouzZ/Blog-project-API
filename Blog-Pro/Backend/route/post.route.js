const { createPost, getAllPosts, getSinglePost, getPostsCount, deletePost, updatePost, toggleLike } = require('../controllers/post.controller')
const { objectIdValidate } = require('../MiddleWares/objectIdValidate')
const { photoUploader } = require('../MiddleWares/photoUpload')
const { verifyToken } = require('../MiddleWares/verifyToken')

const router = require('express').Router()

router.route('/')
.post(verifyToken, photoUploader.single('image'), createPost)
.get(getAllPosts)

router.route('/count')
.get(getPostsCount)

router.route('/:id')
.get(objectIdValidate, getSinglePost)
.delete(verifyToken, objectIdValidate, deletePost)
.put(verifyToken, objectIdValidate, updatePost)

router.route('/like/:id')
.put(verifyToken,objectIdValidate, toggleLike)

module.exports = router
