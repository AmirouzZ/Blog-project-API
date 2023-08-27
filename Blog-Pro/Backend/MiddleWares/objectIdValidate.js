

const mongoose = require('mongoose')

const objectIdValidate = (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message: "invalid Id"})
    }
    next()
}

module.exports = {objectIdValidate}