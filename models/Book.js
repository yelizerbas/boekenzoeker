const mongoose = require('mongoose')

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
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book;