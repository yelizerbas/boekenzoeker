const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
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
    confirmpassword: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    } 
})


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    auteur: {
        type: String,
    },
    genre: {
        type: String,
    },
    img: {
        data: Buffer,
        contentType: String,
    },
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema)

module.exports = { 
    User,
    Book
};