const productDatabase = require('../database/productDatabase');

async function getAllProducts() {
    const products = await productDatabase.getProducts();
    return products;
}

async function getProductById(id) {
    const products = await productDatabase.getProducts();
    const product = products.find((item) => item.id === Number(id));
    return product || null;
}

async function createProduct(productData) {
    const products = await productDatabase.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = { id: newId, ...productData };
    products.push(newProduct);
    await productDatabase.saveProducts(products);
    return newProduct;
}

async function updateProduct(id, data) {
    const products = await productDatabase.getProducts();
    const product = products.find((p) => p.id === Number(id));
    if (!product) {
        return null;
    }
    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price;
    await productDatabase.saveProducts(products);
    return product;
}

async function deleteProduct(id) {
    const products = await productDatabase.getProducts();
    const productIndex = products.findIndex((p) => p.id === Number(id));
    if (productIndex === -1) {
        return null;
    }
    const [deletedProduct] = products.splice(productIndex, 1);
    await productDatabase.saveProducts(products);
    return deletedProduct;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
