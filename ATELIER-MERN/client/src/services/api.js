import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
    baseURL: API_URL,
    timeout: 12000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export function normalizeProduct(product) {
    if (!product) return product;
    const image = product.image || "";
    return {
        ...product,
        image: image.startsWith("http://") || image.startsWith("https://")
            ? image
            : `${API_ORIGIN}/products/${encodeURIComponent(image)}`,
    };
}

export function getApiError(error, fallback = "Something went wrong. Please try again.") {
    return error?.response?.data?.message || error?.message || fallback;
}
