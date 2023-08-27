const joi = require('joi')
const { default: mongoose } = require('mongoose')

const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('comment', commentSchema)

const commentCrateValidate = (obj) => {
    const schema = joi.object({
        postId: joi.string().required().label('Post ID'),
        text: joi.string().trim().required(),
    })
    return schema.validate(obj)
}


const commentUpdateValidate = (obj) => {
    const schema = joi.object({
        text: joi.string().trim().required(),
    })
    return schema.validate(obj)
}

module.exports = {
    Comment, 
    commentCrateValidate,
    commentUpdateValidate
}