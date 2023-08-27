const joi = require('joi')
const { default: mongoose } = require('mongoose')


const categoreySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})


const Categorey = mongoose.model('categorey', categoreySchema)

const categoreyCrateValidate = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().required(),
    })
    return schema.validate(obj)
}

module.exports = {
    Categorey, 
    categoreyCrateValidate
}
