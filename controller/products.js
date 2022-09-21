import fs from 'fs'

//model
import Product from "../model/products"

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProduct = async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editeProduct = async (req, res) => {
    const id = req.params.id
    try {
        await Product.findByIdAndUpdate(id, req.body)
        res.status(200).json({ message: "Prodect update successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id
    try {
        await Product.findByIdAndDelete(id)
        res.status(200).json({ message: "Prodect deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const assignImages = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product)
            return res.status(400).json({ message: "product doesn't exist" });

        req.files.forEach((image) => product.images.push(image.filename));
        await product.save();
        res.status(200).json({ message: "images were added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const { id, image } = req.params;
        const product = await Product.findById(id);

        if (!product)
            return res.status(400).json({ message: "product doesn't exist" });

        const imageExist = product.images.filter((im) => im == image).length;
        if (imageExist === 0)
            return res.status(400).json({ message: "img doesnt exist" });

        product.images.pull(image);
        await product.save();

        if (fs.existsSync("uploads/products/" + image))
            fs.unlinkSync("uploads/products/" + image);
        return res.status(200).json({ message: "image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};