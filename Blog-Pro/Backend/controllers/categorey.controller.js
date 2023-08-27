
const asyncHandler = require('express-async-handler')

const { Categorey, categoreyCrateValidate } = require('../model/Catgorey')

/**
 * @desc create new categ
 * @route /api/categorey
 * @method POST
 * @access private only admin
 */

const createCategorey = asyncHandler(async(req, res) => {
    const { error } = categoreyCrateValidate(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    const categorey = await Categorey.create({
        title: req.body.title,
        user: req.user.id,
    })
    res.status(201).json(categorey)
})

/**
 * @desc get all categs
 * @route /api/categorey
 * @method GET
 * @access public
 */

const getAllCategories = asyncHandler(async(req, res) => {
    
    const categories = await Categorey.find()
    res.status(200).json(categories)
})


/**
 * @desc del categ
 * @route /api/categorey/:id
 * @method delete
 * @access private only admin
 */

const deleteCateg = asyncHandler(async(req, res) => {
    
    const categ = await Categorey.findById(req.params.id)
    if(!categ){
        return res.status(404).json({message: 'Categ not found'})
    }
    await Categorey.findByIdAndDelete(req.params.id)
    res.status(200).json({message: "Category has been deleted successfully"})
})


module.exports = {
    createCategorey,
    getAllCategories,
    deleteCateg,
}