const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    

});

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