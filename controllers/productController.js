const Product = require("../models/Product");

exports.createProduct = async(req ,res) =>{
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({message:"Product created successfully",product});
    } catch (error) {
        res.status(400).json({message:error.message});
    }
};

exports.getAllProducts = async(req,res)=>{
    try {
        const products= await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message:"Error fetching products"});
    }
};

exports.getProductById= async (req,res) =>{
    try {
        const product= await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message:"Product not found"});
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message:"Error fetching the product"});
    }
};

exports.updateProduct = async (req, res) => {
    try {
      // Extract inStock from request body if provided
      const { inStock, ...updateData } = req.body;
  
      // Ensure that the modification date is updated
      const updatedProductData = {
        ...updateData,
        modificationDate: new Date(),
        inStock: inStock !== undefined ? inStock : true, // Default to true if inStock is not provided
      };
  
      // Find the product by ID and update it
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updatedProductData,
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Return the updated product
      res.status(200).json({
        message: "Product updated!",
        product,
      });
    } catch (error) {
      // Return error message if there's an issue
      res.status(400).json({ message: error.message });
    }
  };
  

exports.deleteProduct = async(req,res) =>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({message:"Product not found"});
        res.status(200).json("Product deleted Successfully")
    } catch (error) {
        res.status(500).json({message:"Error deletong the product",error});
    }
};

exports.getProductsByCategory = async(req,res) =>{
  try{
    const category = req.params.categoryName;
    const products = await Product.find({ category });
    res.status(200).json(products);
    }catch(error){
      res.status(500).json({message:"Error fetching products by category",error})
    }
}