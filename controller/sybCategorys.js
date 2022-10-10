//model
import SubCategory from "../model/subCategorys"

export const getSubCategorys = async (req, res) => {
    try {
        const subCategorys = await SubCategory.find().populate({ path: "product" }).exec()
        res.status(200).json(subCategorys)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSubCategory = async (req, res) => {
    const id = req.params.id
    try {
        const subCategory = await SubCategory.findById(id).populate({ path: "product" }).exec()
        res.status(200).json(subCategory)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.create(req.body)
        res.status(200).json(subCategory)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editeSubCategory = async (req, res) => {
    const id = req.params.id
    try {
        await SubCategory.findByIdAndUpdate(id, req.body)
        res.status(200).json({ message: "SubCategory update successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteSubCategory = async (req, res) => {
    const id = req.params.id
    try {
        await SubCategory.findByIdAndDelete(id)
        res.status(200).json({ message: "SubCategory deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addToSubCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        const category = await SubCategory.findById(category_id);

        if (!category)
            return res.status(400).json({ message: "SubCategory doesn't exist" });

        const check = category.product.some((item) => item.toString() === req.body.product)
        if (check)
            return res.status(400).json({ message: "Product already in the Category" });

        category.product.push(req.body.product);
        await category.save();

        return res.status(200).json({ message: "add successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFromSubCategory = async (req, res) => {
    try {
        const category_id = req.params.id;
        const category = await SubCategory.findById(category_id);

        if (!category)
            return res.status(400).json({ message: "SubCategory doesn't exist" });

        if (req.body.product)
            category.product = category.product.filter((item) => item.toString() !== req.body.product)

        await category.save();
        return res.status(200).json({ message: "delete successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};