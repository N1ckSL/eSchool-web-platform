require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    uploadTimeout:true
}))


// Routes
app.use('/user',require('./routes/userRouter'))
app.use('/elev',require('./routes/elevRouter'))

// Conexiunea la mongoDB
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex:true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log("Connected to MongoDB!");
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server running on port: ', PORT)
})

module.exports.Users = require("./models/userModel")
module.exports.Elev = require("./models/elevModel")
module.exports.ElevInstanta = require("./models/elevModelInstanta")
module.exports.Profesor = require("./models/profesorModel")
module.exports.Secretar = require("./models/secretarModel")
module.exports.Note = require("./models/noteModel")