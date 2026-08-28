

// const SellerProduct = require("../model/sellerProduct");
// const Review = require("../model/review");

// // =====================================
// // GET ALL ACTIVE PRODUCTS
// // =====================================
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await SellerProduct.find({
//       isActive: true,
//       stock: { $gt: 0 },
//     })
//       .populate("sellerId", "name phone location")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       message: "Products fetched successfully",
//       products,
//     });
//   } catch (error) {
//     console.error("Get All Products Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =====================================
// // GET SINGLE PRODUCT WITH REVIEWS
// // =====================================
// const getProductById = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const product = await SellerProduct.findOne({
//       _id: productId,
//       isActive: true,
//     }).populate("sellerId", "name phone storeAddress location");

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     let reviews = [];
//     try {
//       reviews = await Review.find({ productId }).sort({ createdAt: -1 });
//     } catch (rErr) {
//       console.warn("No reviews collection found yet:", rErr.message);
//     }

//     res.status(200).json({
//       success: true,
//       message: "Product fetched successfully",
//       product,
//       reviews,
//     });
//   } catch (error) {
//     console.error("Get Product By ID Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // =====================================
// // ADD PRODUCT REVIEW (OPTIONAL)
// // =====================================
// const addProductReview = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { rating, comment } = req.body;
//     const customerId = req.user?.id || req.user?._id;
//     const customerName = req.user?.name || "Verified Customer";

//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         message: "Rating must be between 1 and 5",
//       });
//     }

//     const product = await SellerProduct.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     const review = await Review.create({
//       productId,
//       sellerId: product.sellerId,
//       customerId,
//       customerName,
//       rating: Number(rating),
//       comment: comment || "",
//     });

//     // গড় রেটিং এবং রিভিউ কাউন্ট আপডেট করা
//     const allReviews = await Review.find({ productId });
//     const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

//     product.averageRating = Number(avg.toFixed(1));
//     product.totalReviews = allReviews.length;
//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: "Review added successfully",
//       review,
//       averageRating: product.averageRating,
//       totalReviews: product.totalReviews,
//     });
//   } catch (error) {
//     console.error("Add Review Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // =====================================
// // GET PRODUCTS BY CATEGORY
// // =====================================
// const getProductsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;

//     const products = await SellerProduct.find({
//       category: category,
//       isActive: true,
//       stock: { $gt: 0 },
//     })
//       .populate("sellerId", "name phone location")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       message: "Category products fetched successfully",
//       products,
//     });
//   } catch (error) {
//     console.error("Get Category Products Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // =====================================
// // SEARCH PRODUCTS
// // =====================================
// const searchProducts = async (req, res) => {
//   try {
//     const { keyword } = req.query;

//     if (!keyword) {
//       return res.status(400).json({ message: "Search keyword is required" });
//     }

//     const products = await SellerProduct.find({
//       isActive: true,
//       stock: { $gt: 0 },
//       $or: [
//         { productName: { $regex: keyword, $options: "i" } },
//         { category: { $regex: keyword, $options: "i" } },
//       ],
//     })
//       .populate("sellerId", "name phone location")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       message: "Search results fetched successfully",
//       products,
//     });
//   } catch (error) {
//     console.error("Search Products Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   getAllProducts,
//   getProductById,
//   addProductReview,
//   getProductsByCategory,
//   searchProducts,
// };



















const SellerProduct = require("../model/sellerProduct");
const { getIO } = require("../config/socket");

// =====================================
// GET ALL ACTIVE PRODUCTS
// =====================================
const getAllProducts = async (req, res) => {
  try {
    const products = await SellerProduct.find({
      isActive: true,
      stock: { $gt: 0 },
    })
      .populate("sellerId", "name phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// GET SINGLE PRODUCT & INCREMENT VIEW COUNT
// =====================================
const getProductById = async (req, res) => {
  try {
    const { productId, id } = req.params;
    const targetId = productId || id;

    // ক্লিক করার সাথে সাথে ভিউ কাউন্ট ১ বৃদ্ধি করা
    const product = await SellerProduct.findByIdAndUpdate(
      targetId,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("sellerId", "name phone storeAddress location");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔔 সেলার ড্যাশবোর্ডে রিয়েল-টাইম সকেট অ্যালার্ট
    try {
      const io = getIO();
      if (io && product.sellerId) {
        const sellerRoom = `seller_${String(product.sellerId._id || product.sellerId)}`;
        io.to(sellerRoom).emit("productViewUpdated", {
          productId: product._id,
          viewCount: product.viewCount,
        });
      }
    } catch (sErr) {
      console.warn("Socket view emission warning:", sErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================
// GET PRODUCTS BY CATEGORY
// =====================================
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await SellerProduct.find({
      category: category,
      isActive: true,
      stock: { $gt: 0 },
    })
      .populate("sellerId", "name phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Category products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get Category Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================
// SEARCH PRODUCTS
// =====================================
const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Search keyword is required" });
    }

    const products = await SellerProduct.find({
      isActive: true,
      stock: { $gt: 0 },
      $or: [
        { productName: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate("sellerId", "name phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Search results fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
};