
const Wishlist = require("../models/wishlist.model");

exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { userId, name, description } = req.body;

        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        wishlist.items.push({ name, description });
        await wishlist.save();

        res.status(201).json({ message: "Item added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFromWishlist = async (req, res) => {
    try {
        const { userId, itemName } = req.body;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.items = wishlist.items.filter((item) => item.name !== itemName);
        await wishlist.save();

        res.status(200).json({ message: "Item removed from wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    