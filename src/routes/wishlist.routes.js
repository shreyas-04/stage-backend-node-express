
const express = require("express");
const {
    getWishlist,
    addToWishlist,
    deleteFromWishlist,
} = require("../controllers/wishlist.controller");

const router = express.Router();

router.get("/wishlist/:userId", getWishlist);
router.post("/wishlist", addToWishlist);
router.delete("/wishlist", deleteFromWishlist);

module.exports = router;
    