const joi = require('joi')
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlngth: 2,
        maxlength: 200
    }, 
    description: {
        type: String,
        required: true,
        trim: true,
        minlngth: 10,
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    categorey: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        default: {
            url: '',
            publicId: null
        },
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

postSchema.virtual('comments', 
{
    ref: 'comment',
    foreignField: "postId",
    localField: "_id"
})

const Post = mongoose.model('post', postSchema)

const postCreateValidation = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200).required(),
        description: joi.string().trim().min(10).required(),
        categorey: joi.string().trim().required(),
    })
    return schema.validate(obj)
}


const postUpdateValidation = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().min(2).max(200),
        description: joi.string().trim().min(10),
        categorey: joi.string().trim(),
    })
    return schema.validate(obj)
}

module.exports = { 
    Post,
    postCreateValidation,
    postUpdateValidation
}
