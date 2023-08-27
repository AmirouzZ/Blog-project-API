const path = require('path')
const multer = require('multer')

// photo storage 
const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'))
    },
    filename: (req, file, cb) => {
    if(file){
        cb(null, Date.now() + "-" + file.originalname)
    } else {
        cb(null, false)  // false means do not name the file because no file uploaded
    }
    }
})

// photo upload
const photoUploader = multer({
    storage: photoStorage,
    limits: {fileSize: 1024 * 1024}, // 1 megabyte
    fileFilter: (req, file, cb) => {
        if(!file.mimetype.startsWith('image')){
            cb({message: "Unsupported file format"}, false)
        } else {
            cb(null, true)
        }
    }
})


module.exports = { photoUploader }