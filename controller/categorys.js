//model
import Category from "../model/categorys"

export const getCategorys = async (req, res) => {
    try {
        const categorys = await Category.find().populate({ path: "subCategory" }).exec()
        res.status(200).json(categorys)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategory = async (req, res) => {
    const id = req.params.id
    try {
        const category = await Category.findById(id).populate({ path: "subCategory" }).exec()
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body)
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editeCategory = async (req, res) => {
    const id = req.params.id
    try {
        await Category.findByIdAndUpdate(id, req.body)
        res.status(200).json({ message: "Category update successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    const id = req.params.id
    try {
        await Category.findByIdAndDelete(id)
        res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addToCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        const category = await Category.findById(category_id);

        if (!category)
            return res.status(400).json({ message: "Category doesn't exist" });

        const check = category.subCategory.some((item) => item.toString() === req.body.subCategory)
        if (check)
            return res.status(400).json({ message: "SubCategory already in the Category" });

        category.subCategory.push(req.body.subCategory);
        await category.save();

        return res.status(200).json({ message: "add successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFromCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        const category = await Category.findById(category_id);

        if (!category)
            return res.status(400).json({ message: "Category doesn't exist" });

        if (req.body.subCategory)
            category.product = category.subCategory.filter((item) => item.toString() !== req.body.subCategory)

        await category.save();
        return res.status(200).json({ message: "delete successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};