const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true,
        maxLength: 500
    },
    size: {
        type: [String], // Array of strings for sizes (e.g., ["S", "M", "L", "XL"])
        required: true,
    },
    color: {
        type: [String], // Array of strings for colors (e.g., ["#FF5733", "#33FF57"])
        required: true,
    },
    productImage: {
        type: String,
        required: true
    },
    createAt : {
        type: Date,
        default: Date.now()
    }
})

const Product = mongoose.model('products', productSchema)
module.exports = Product;
