import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;