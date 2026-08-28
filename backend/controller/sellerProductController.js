


const SellerProduct = require("../model/sellerProduct");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// // =====================================
// // ADD PRODUCT (WITH MULTIPLE IMAGE UPLOAD)
// // =====================================
// const addProduct = async (req, res) => {
//   try {
//     const {
//       title,
//       productName,
//       description,
//       category,
//       price,
//       discountPrice,
//       stock,
//       unit,
//     } = req.body;

//     const finalName = productName || title;

//     if (!finalName || price === undefined || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Product name, category, and price are required",
//       });
//     }

//     const uploadedImageUrls = [];

//     // 📸 একাধিক ফাইল ক্লাউডিনারিতে আপলোড করা (req.files অথবা সিঙ্গেল req.file)
//     const files = req.files || (req.file ? [req.file] : []);

//     if (files.length > 0) {
//       for (const file of files) {
//         try {
//           const uploadRes = await cloudinary.uploader.upload(file.path, {
//             folder: "grocera_products",
//           });
//           uploadedImageUrls.push(uploadRes.secure_url);

//           // লোকাল টেম্প ফাইল ডিলিট
//           if (fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//           }
//         } catch (uploadErr) {
//           console.error("Cloudinary upload failed for a file:", uploadErr);
//         }
//       }
//     }

//     const product = await SellerProduct.create({
//       sellerId: req.seller.id,
//       productName: finalName,
//       description: description || `${finalName} - Fresh grocery item`,
//       category,
//       price: Number(price),
//       discountPrice: discountPrice ? Number(discountPrice) : 0,
//       stock: stock !== undefined ? Number(stock) : 50,
//       images:
//         uploadedImageUrls.length > 0
//           ? uploadedImageUrls
//           : ["https://placehold.co/400x400?text=Product"],
//       unit: unit || "1 kg",
//       isActive: true,
//       viewCount: 0,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Add Product Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message,
//     });
//   }
// };








// =====================================
// ADD PRODUCT
// =====================================
const addProduct = async (req, res) => {
  try {
    const {
      title,
      productName,
      description,
      category,
      price,
      discountPrice,
      stock,
      unit,
    } = req.body;

    const finalName = productName || title;
    const sellerId = req.seller?._id || req.seller?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Seller unauthorized or session expired",
      });
    }

    if (!finalName || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Product name, category, and price are required",
      });
    }

    const uploadedImageUrls = [];

    // একাধিক ফাইল (req.files) বা সিঙ্গেল ফাইল (req.file) থেকে ক্লাউডিনারি আপলোড
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length > 0) {
      for (const file of files) {
        try {
          const uploadRes = await cloudinary.uploader.upload(file.path, {
            folder: "grocera_products",
          });
          uploadedImageUrls.push(uploadRes.secure_url);

          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
        }
      }
    }

    const product = await SellerProduct.create({
      sellerId: sellerId,
      productName: finalName,
      description: description || `${finalName} - Fresh grocery item`,
      category: category || "Grocery",
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: stock !== undefined ? Number(stock) : 50,
      images:
        uploadedImageUrls.length > 0
          ? uploadedImageUrls
          : ["https://placehold.co/400x400?text=Product"],
      unit: unit || "1 kg",
      isActive: true,
      viewCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product 500 Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};








// =====================================
// GET ALL ACTIVE PRODUCTS (FOR CUSTOMER HOME PAGE)
// =====================================
const getAllProductsForCustomer = async (req, res) => {
  try {
    const products = await SellerProduct.find({ isActive: true })
      .populate("sellerId", "name phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Fetch Customer Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// =====================================
// GET MY PRODUCTS (FOR SELLER DASHBOARD)
// =====================================
const getMyProducts = async (req, res) => {
  try {
    const products = await SellerProduct.find({
      sellerId: req.seller.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// GET SINGLE PRODUCT
// =====================================
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await SellerProduct.findOne({
      _id: productId,
      sellerId: req.seller.id,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// UPDATE PRODUCT
// =====================================
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, title, description, category, price, discountPrice, stock, unit } = req.body;

    const product = await SellerProduct.findOne({
      _id: productId,
      sellerId: req.seller.id,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (productName || title) product.productName = productName || title;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (stock !== undefined) product.stock = Number(stock);
    if (unit !== undefined) product.unit = unit;

    const files = req.files || (req.file ? [req.file] : []);
    if (files.length > 0) {
      const newUrls = [];
      for (const file of files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: "grocera_products",
        });
        newUrls.push(uploadRes.secure_url);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
      product.images = newUrls;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// DELETE PRODUCT
// =====================================
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await SellerProduct.findOneAndDelete({
      _id: productId,
      sellerId: req.seller.id,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// UPDATE STOCK
// =====================================
const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action, quantity } = req.body;

    if (!["increase", "decrease"].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be increase or decrease" });
    }

    const product = await SellerProduct.findOne({ _id: productId, sellerId: req.seller.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (action === "increase") product.stock += Number(quantity);
    if (action === "decrease") {
      if (product.stock < Number(quantity)) {
        return res.status(400).json({ success: false, message: "Not enough stock" });
      }
      product.stock -= Number(quantity);
    }

    await product.save();
    res.status(200).json({ success: true, message: "Stock updated successfully", stock: product.stock, product });
  } catch (error) {
    console.error("Update Stock Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// UPDATE PRICE
// =====================================
const updatePrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;

    const product = await SellerProduct.findOne({ _id: productId, sellerId: req.seller.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.price = Number(price);
    await product.save();
    res.status(200).json({ success: true, message: "Price updated successfully", product });
  } catch (error) {
    console.error("Update Price Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// UPDATE DISCOUNT
// =====================================
const updateDiscount = async (req, res) => {
  try {
    const { productId } = req.params;
    const { discountPrice } = req.body;

    const product = await SellerProduct.findOne({ _id: productId, sellerId: req.seller.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.discountPrice = Number(discountPrice);
    await product.save();
    res.status(200).json({ success: true, message: "Discount updated successfully", product });
  } catch (error) {
    console.error("Update Discount Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// TOGGLE STATUS
// =====================================
const toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await SellerProduct.findOne({ _id: productId, sellerId: req.seller.id });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();
    res.status(200).json({
      success: true,
      message: product.isActive ? "Product activated" : "Product deactivated",
      isActive: product.isActive,
      product,
    });
  } catch (error) {
    console.error("Toggle Product Status Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addProduct,
  getAllProductsForCustomer,
  getMyProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updatePrice,
  updateDiscount,
  toggleProductStatus,
};