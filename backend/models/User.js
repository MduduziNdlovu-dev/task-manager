import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    }

})

const User = mongoose.model("User", userSchema);

export default User;
// This code defines a Mongoose schema and model for a User entity in a MongoDB database. The schema includes fields for id, firstname, lastname, email, password, and createAt (with a default value of the current date). The model is then exported for use in other parts of the application.