const path = require('path')
const productModel = require('../models/productModel')
const fs = require('fs') // fs= filesystem

const createProduct = async (req, res) => {
   
    console.log(req.body)
    console.log(req.files)

    // Destructuring the body data (json)
    const { productName,
        productPrice,
        productCategory,
        productDescription,
        size,
        color
    } = req.body;

    // Validation
    if (!productName || !productPrice || !productCategory || !productDescription || !size || !color) {
        return res.status(400).json({
            "success": false,
            "message": "Enter all fields!"
        })
    }

    // validate for image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            "success": false,
            "message": "Image not found!"
        })
    }
    const { productImage } = req.files;

    // Upload image
    const imageName = `${Date.now()}-${productImage.name}`

    // 2. Make an upload path (/path/upload - directory)
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)    // 2 underscores __directory name, then make a public folder with products

    // 3. Move to that directory (await for background upload, try-catch  for internet crashes)
    try {
        await productImage.mv(imageUploadPath) // mv is move
        // res.send("Image Uploaded Successfully!")

        // Save to database
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            size: JSON.parse(size), // Parse size if sent as a JSON string
            color: JSON.parse(color),
            productImage: imageName // product iumage is imageName that is changed as a unique name
        })
        const product = await newProduct.save() // it takes time to save to database
        res.status(201).json({
            "success": true,
            "message": "Product Created Successfuly!",
            "data": product
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error!",
            "error": error
        })

    }


};


// Fetch all products
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number from query params, default to 1
    const limit = parseInt(req.query.limit) || 9; // Limit number from query params, default to 9

    try {
        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await productModel
            .find()
            .skip(skip)
            .limit(limit);

        // Count total products (for pagination metadata)
        const totalCount = await productModel.countDocuments();

        res.status(200).json({
            "success": true,
            "message": 'Products fetched successfully',
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            "success": false,
            "message": 'Internal Server Error',
            "error": error
        });
    }
};


const paginationProduct = async (req, res) => {
    const pageNo = req.query.page || 1;
    const resultPerPage = 9;

    try {
        const products = await productModel
            .find({})
            .skip((pageNo - 1) * resultPerPage)
            .limit(resultPerPage);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Fetch single product
const getSingleProduct = async (req, res) => {

    // get product id of editable product from URL (params) 
    const productId = req.params.id;

    // Find the product from id
    try {
        const product = await productModel.findById(productId)
        if (!product) {
            res.status(400).json({
                "success": false,
                "message": "No product found!",
            })

        }
        res.status(201).json({
            "success": true,
            "message": "Product Fetched Successfully!",
            "products": product
        })

    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Internal server error!",
            "error": error
        })
    }

}

// delete product
const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.status(201).json({
            "success": true,
            "message": "Product deleted succesfully!",
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal server error!",
            "error": error
        })
    }
}

// Update Product

const updateProduct = async (req, res) => {
    try {
        // if there is image
        if (req.files && req.files.productImage) {
            // destructuring 
            const { productImage } = req.files;

            // upload image to /public/products folder
            // 1. Generate new unique image name (abc.png) -> (213456-abc.png)
            const imageName = `${Date.now()}-${productImage.name}`

            // 2. Make an upload path (/path/upload - directory)
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)    // 2 underscores __directory name, then make a public folder with products


            // move to folder
            await productImage.mv(imageUploadPath)

            // req.params has  (id ), req.body( has updated data - product name, pp, pc, pd), req. files (image)
            // add new field to req.body (productImage -> namae)
            req.body.productImage = imageName; // image uploaded and  its generated name

            // if image is uploaded and req.body is assigned ==>delete old image
            if (req.body.productImage) {

                // Finding existing product
                const existingProduct = await productModel.findById(req.params.id)

                // Searching in the directory/folder
                const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)    // 2 underscores __directory name, then make a public folder with products

                // delete old image from filesystem
                fs.unlinkSync(oldImagePath)
            }

        }

        // update the data
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).json({
            "success": true,
            "message": "Product updated!",
            "product": updatedProduct

        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal server error!",
            "error": error
        })
    }


}



module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    paginationProduct
}