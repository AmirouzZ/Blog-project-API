const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    if(!req.headers.token){
        return res.status(401).json({message: "NO Token Provided, Access Denied"}) // 401: unauthorized
    }
    // try {

        jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    //    if(decoded){console.log("9999")}
    //    if (!decoded){console.log("nooo nooo")}
    //     req.user = decoded
    //     console.log(decoded)
        next()
    // } catch (error) {
    //     console.log(error)
    //     res.status(401).json({message: "Invalid Token"}) 
    // }
}

const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json({message: "Not Allowed, Only Admin"})// forbidden
        }
    })
}

// User Himself

const onlyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id){
            next()
        }
        else{
            return res.status(403).json({message: "Not Allowed, Only user himself"})// forbidden
        }
    })
}
// admin or user himself
const adminOrUserHimself = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json({message: "Not Allowed, Only user himself or admin"})// forbidden
        }
    })
}



module.exports = { isAdmin, onlyUser, verifyToken, adminOrUserHimself }