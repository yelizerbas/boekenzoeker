var mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titel: {
        type: String,
    },
    auteur: {
        type: String,
    },
    genre: {
        type: String,
    },
    imgSrc: {
        type: String,
    }
});

const books = mongoose.model('books', bookSchema)

module.exports = books;