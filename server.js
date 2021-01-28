const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose")
const passport = require("passport")

dotenv.config();
const app = express();

const port = process.env["PORT"] || 5000

const mongoUrl = process.env['MONGO_URL']
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err){
        console.log("there is an error " + err)
        return
    }
    console.log("db successfully connected")
})

app.use(cors())
app.use(express.json())
app.use(passport.initialize())

//models and routes
require("./models/UserModel")
require("./config/passport")
app.use(require("./routes"))


app.listen(port, () => {
    console.log("server started")
}) 