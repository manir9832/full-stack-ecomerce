
const express = require("express"); 
const { addToCart, getCart, updateCartQuantity, removeFromCart, clearCart } = require("../controller/cartController");
const userAuth = require("../middleware/userAuth"); 
const router = express.Router();

router.post("/add", userAuth, addToCart);

router.get("/", userAuth, getCart);

router.delete("/clear", userAuth, clearCart);

router.put("/:productId", userAuth, updateCartQuantity);

router.delete("/:productId", userAuth, removeFromCart);
module.exports = router;