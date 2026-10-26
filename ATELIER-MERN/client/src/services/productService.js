import { productData } from "../data/products";
import { api, normalizeProduct } from "./api";

export async function getProducts() {
    try {
        const response = await api.get("/products");
        if (!Array.isArray(response.data)) throw new Error("Invalid products response.");
        return response.data.map(normalizeProduct);
    } catch (error) {
        // The local catalogue keeps the storefront previewable before the API is configured.
        if (Array.isArray(productData) && productData.length > 0) return productData;
        throw error;
    }
}

export async function getProductById(id) {
    try {
        const response = await api.get(`/products/${encodeURIComponent(id)}`);
        return normalizeProduct(response.data);
    } catch (error) {
        const products = await getProducts();
        const product = products.find((item) => Number(item.id) === Number(id)) || null;
        if (product) return product;
        if (error?.response?.status === 404) return null;
        throw error;
    }
}
