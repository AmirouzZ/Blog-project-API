const mongoose = require('mongoose')

const verificationTokenSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true
    }
}, {
    timeStamps: true
})

const VerificationToken = mongoose.model('verificationToken', verificationTokenSchema)

module.exports = VerificationToken