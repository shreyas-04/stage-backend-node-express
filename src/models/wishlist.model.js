
const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            name: { type: String, required: true },
            description: { type: String },
            addedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
    