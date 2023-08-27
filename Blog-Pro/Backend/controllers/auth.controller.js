
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { User, userRegisterValidation, userLoginValidation} = require('../model/User.model')
const VerificationToken = require('../model/VerificationToken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

/**
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access public
 */

const register = asyncHandler( async(req, res) => {
    const {error} = userRegisterValidation(req.body)
    if(error){ 
        return res.status(400).json({message: error.details[0].message})
    }
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({message: "This Email Is Already Registered"})
    }
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
    user = new User(req.body)
    await user.save()
    // ===============================================================
    // send and verify email
    // 1. create new verificationtoken 
    // const verificationToken = new VerificationToken({
    //     user: user._id,
    //     token: crypto.randomBytes(32).toString('hex')
    // })
    //await verificationToken.save()
    const secret=process.env.JWT_SECRET_KEY
    const token = jwt.sign({id:user._id, email:user.email},secret, {
        expiresIn :"10m"
    })
    //2. create link
    const link = `http://localhost:5000/users/${user._id}/verify/${token}`
    //3. create html template
    const htmlTemplate = 
    `
    <div>
    <p>Click on the link to verify your email</p>
    <a href="${link}">Verify</a>
    </div>
    `
    //4. send email to user email
    sendEmail(user.email, "Verify your email", htmlTemplate)
    //=================================================================
    res.status(201).json({message: "we have sent a link to your email please check your inbox"})//.json({message: "You registered successfully, please log in"})
})

/**
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access public
 */
const login = asyncHandler( async(req, res) => {
    const {error} = userLoginValidation(req.body)
    if(error){ 
        return res.status(400).json({message: error.details[0].message})
    }
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(404).json({message: "This Email Is Not Registered"})
    }
    same = await bcrypt.compare(req.body.password, user.password)
    if(!same){
        return res.status(400).json({message: "Incorrect Password"})
    }
    const token = user.generateToken()
    res.status(200).json({
        id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token
    })
})

module.exports = {register, login}