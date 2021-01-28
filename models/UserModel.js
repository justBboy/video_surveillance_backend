const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {Schema} = mongoose;

const UsersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String
    },
    hash: {
        type: String,
        required: true
    },
    salt: String
})

UsersSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512');
}

UsersSchema.methods.validatePassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, "sha512");
    return this.hash === hash
}

UsersSchema.methods.generateJWT = function(){
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, process.env["JWT_SECRET"])
}

UsersSchema.methods.toAuthJSON = function(){
    return {
        _id: this._id,
        email: this.email,
        role: this.role,
        token: this.generateJWT()
    }
}

mongoose.model("Users", UsersSchema);