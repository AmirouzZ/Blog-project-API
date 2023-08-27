const router = require('express').Router()

const { createComment, getAllComments, deleteComment, updateComment } = require('../controllers/comment.controller')
const { verifyToken, isAdmin } = require('../MiddleWares/verifyToken')
const { objectIdValidate } = require('../MiddleWares/objectIdValidate')

router.route('/').post(verifyToken, createComment).get(isAdmin, getAllComments)
router.route('/:id')
.delete(objectIdValidate, verifyToken, deleteComment)
.put(objectIdValidate, verifyToken, updateComment)
module.exports = router