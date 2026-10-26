import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";
import useProductFilters, { toValues } from "../hooks/useProductFilters";
import "../styles/shop.css";

const PRICE_OPTIONS = [
    { label: "ALL", value: "all" },
    { label: "UNDER $300", value: "under-300" },
    { label: "$300 - $500", value: "300-500" },
    { label: "$500 - $700", value: "500-700" },
    { label: "$700+", value: "700-plus" },
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [size, setSize] = useState("All");
    const [color, setColor] = useState("All");
    const [price, setPrice] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError("");

        getProducts()
            .then((data) => {
                if (active) setProducts(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (active) {
                    setProducts([]);
                    setError("We couldn't load the collection right now. Please try again.");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const category = searchParams.get("category") || "All";

    const sizes = useMemo(() => {
        const values = products.flatMap((product) => toValues(product.sizes));
        return [
            { label: "ALL", value: "All" },
            ...[...new Set(values)].map((value) => ({ label: value, value })),
        ];
    }, [products]);

    const colors = useMemo(() => {
        const values = products.flatMap((product) => toValues(product.colors));
        return [
            { label: "ALL", value: "All" },
            ...[...new Set(values)].map((value) => ({ label: value, value })),
        ];
    }, [products]);

    const filteredProducts = useProductFilters(products, category, size, color, price);


    const heading = category === "All" ? "Shop All" : category;

    return (
        <main className="shop-page">
            <section className="shop-header">
                <h1>{heading}</h1>
                <CategoryFilter
                    size={size}
                    setSize={setSize}
                    color={color}
                    setColor={setColor}
                    price={price}
                    setPrice={setPrice}
                    sizes={sizes}
                    colors={colors}
                    priceOptions={PRICE_OPTIONS}
                />
            </section>

            <section className="shop-products">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border" role="status" aria-label="Loading">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading collection...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button type="button" onClick={() => window.location.reload()}>TRY AGAIN</button>
                    </div>
                ) : (
                    <ProductGrid products={filteredProducts} />
                )}
            </section>
        </main>
    );
}

