const mongoose = require('mongoose')

const connectToDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)        
        console.log("Connected to DataBase Successfully")
    } catch (error) {
        console.log('Failed to Connect to mongoDB', error)
    }
}

module.exports = {connectToDB}