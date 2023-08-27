const router = require('express').Router()

const { verifyToken, isAdmin } = require('../MiddleWares/verifyToken')
const { createCategorey, getAllCategories, deleteCateg} = require('../controllers/categorey.controller')
const { objectIdValidate } = require('../MiddleWares/objectIdValidate')
router.route('/')
.post(isAdmin ,createCategorey)
.get(getAllCategories)

router.route('/:id')
.delete(objectIdValidate, isAdmin, deleteCateg)

module.exports = router