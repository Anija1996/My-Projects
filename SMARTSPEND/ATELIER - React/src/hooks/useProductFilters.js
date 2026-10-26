import { useMemo } from "react";

const normalize = (value) => String(value ?? "").trim().toLowerCase();

const toValues = (value) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
    return [];
};

function matchesPrice(price, selectedPrice) {
    const amount = Number(String(price ?? "").replace(/[^0-9.]/g, ""));
    if (Number.isNaN(amount)) return false;

    switch (selectedPrice) {
        case "under-300": return amount < 300;
        case "300-500": return amount >= 300 && amount < 500;
        case "500-700": return amount >= 500 && amount < 700;
        case "700-plus": return amount >= 700;
        default: return true;
    }
}

export default function useProductFilters(products, category, size, color, price) {
    return useMemo(() => products.filter((product) => {
        const productCategory = normalize(product.category);
        const productSizes = toValues(product.sizes);
        const productColors = toValues(product.colors);
        const selectedCategory = normalize(category);
        const selectedSize = normalize(size);
        const selectedColor = normalize(color);

        const categoryMatches =
            selectedCategory === "all" ||
            selectedCategory === "essentials" ||
            productCategory === selectedCategory;

        const sizeMatches =
            selectedSize === "all" ||
            productSizes.some((item) => normalize(item) === selectedSize);

        const colorMatches =
            selectedColor === "all" ||
            productColors.some((item) => normalize(item) === selectedColor);

        return categoryMatches && sizeMatches && colorMatches && matchesPrice(product.price, price);
    }), [products, category, size, color, price]);
}

export { normalize, toValues, matchesPrice };
