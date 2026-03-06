const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products', 'name price images description category');
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
        // Check if product already exists
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
    }
    
    // Populate to return the updated list or just success message
    await wishlist.populate('products', 'name price images');

    res.status(200).json({ success: true, message: 'Added to wishlist', wishlist });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (wishlist) {
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
        await wishlist.save();
        await wishlist.populate('products', 'name price images');
    }

    res.status(200).json({ success: true, message: 'Removed from wishlist', wishlist });
  } catch (error) {
    next(error);
  }
};