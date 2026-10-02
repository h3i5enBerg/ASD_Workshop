const productService = require('../services/productService');
const cache = require('../middleware/cacheMiddleware');

async function getProducts(req, res) {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch products'
        });
    }
}

async function getProductById(req, res) {
    try {
        const id = Number(req.params.id);
        const product = await productService.getProductById(id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to fetch product'
        });
    }
}

async function createProduct(req, res) {
    try {
        const product = await productService.createProduct(req.body);
        cache.clearCache();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to create product'
        });
    }
}

async function updateProduct(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        const product = await productService.updateProduct(id, data);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        cache.clearCache();
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update product'
        });
    }
}

async function deleteProduct(req, res) {
    try {
        const id = req.params.id;
        const product = await productService.deleteProduct(id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        cache.clearCache();
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to delete product'
        });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
