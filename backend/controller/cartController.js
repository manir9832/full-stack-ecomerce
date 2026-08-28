

const User = require("../model/user");
const SellerProduct = require("../model/sellerProduct");

// =====================================
// ADD PRODUCT TO CART
// =====================================

const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        const userId = req.user.id;

        // Required fields
        if (!productId || !quantity) {
            return res.status(400).json({
                message: "Product ID and quantity are required"
            });
        }

        const qty = Number(quantity);

        if (!Number.isInteger(qty) || qty <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // Find product
        const product =
            await SellerProduct.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check active
        if (!product.isActive) {
            return res.status(400).json({
                message: "Product is currently unavailable"
            });
        }

        // Check stock
        if (product.stock < qty) {
            return res.status(400).json({
                message: "Not enough stock available"
            });
        }

        // Find user
        const user =
            await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // CartItems is an object
        const cart = user.CartItems || {};

        // Existing quantity
        const existingQuantity =
            Number(cart[productId]) || 0;

        const newQuantity =
            existingQuantity + qty;

        // Check total quantity with stock
        if (newQuantity > product.stock) {
            return res.status(400).json({
                message:
                    "Requested quantity exceeds available stock"
            });
        }

        // Add / update cart
        cart[productId] = newQuantity;

        user.CartItems = cart;

        await user.save();

        res.status(200).json({
            message: "Product added to cart successfully",
            cartItems: user.CartItems
        });

    } catch (error) {

        console.error(
            "Add To Cart Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// GET MY CART
// =====================================

const getCart = async (req, res) => {
    try {

        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const cartItems =
            user.CartItems || {};

        const productIds =
            Object.keys(cartItems);

        // Empty cart
        if (productIds.length === 0) {
            return res.status(200).json({
                message: "Cart is empty",
                cartItems: {},
                products: []
            });
        }

        // Find products
        const products =
            await SellerProduct.find({
                _id: {
                    $in: productIds
                },
                isActive: true
            })
            .populate(
                "sellerId",
                "name phone location"
            );

        // Attach quantity to every product
        const cartProducts =
            products.map(product => {

                return {
                    product,
                    quantity:
                        Number(
                            cartItems[
                                product._id.toString()
                            ]
                        ) || 0
                };

            });

        res.status(200).json({
            message: "Cart fetched successfully",
            cartItems,
            products: cartProducts
        });

    } catch (error) {

        console.error(
            "Get Cart Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// UPDATE CART QUANTITY
// =====================================

const updateCartQuantity = async (req, res) => {
    try {

        const { productId } = req.params;
        const { quantity } = req.body;

        const qty = Number(quantity);

        if (!Number.isInteger(qty) || qty <= 0) {
            return res.status(400).json({
                message:
                    "Quantity must be greater than 0"
            });
        }

        // Find product
        const product =
            await SellerProduct.findById(
                productId
            );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check stock
        if (qty > product.stock) {
            return res.status(400).json({
                message:
                    "Quantity exceeds available stock"
            });
        }

        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const cart =
            user.CartItems || {};

        // Product not in cart
        if (!cart[productId]) {
            return res.status(404).json({
                message:
                    "Product is not in your cart"
            });
        }

        cart[productId] = qty;

        user.CartItems = cart;

        await user.save();

        res.status(200).json({
            message:
                "Cart quantity updated successfully",

            cartItems:
                user.CartItems
        });

    } catch (error) {

        console.error(
            "Update Cart Quantity Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// REMOVE PRODUCT FROM CART
// =====================================

const removeFromCart = async (req, res) => {
    try {

        const { productId } = req.params;

        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const cart =
            user.CartItems || {};

        if (!cart[productId]) {
            return res.status(404).json({
                message:
                    "Product is not in your cart"
            });
        }

        // Remove product
        delete cart[productId];

        user.CartItems = cart;

        await user.save();

        res.status(200).json({
            message:
                "Product removed from cart successfully",

            cartItems:
                user.CartItems
        });

    } catch (error) {

        console.error(
            "Remove From Cart Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// CLEAR CART
// =====================================

const clearCart = async (req, res) => {
    try {

        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.CartItems = {};

        await user.save();

        res.status(200).json({
            message:
                "Cart cleared successfully",

            cartItems: {}
        });

    } catch (error) {

        console.error(
            "Clear Cart Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================
// EXPORT
// =====================================

module.exports = {

    addToCart,

    getCart,

    updateCartQuantity,

    removeFromCart,

    clearCart

};