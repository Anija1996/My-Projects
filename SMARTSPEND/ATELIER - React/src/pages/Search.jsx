import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";
import "../styles/shop.css";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then(setProducts).finally(() => setLoading(false));
    }, []);

    const results = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return [];
        return products.filter((product) => product.name.toLowerCase().includes(term));
    }, [products, query]);

    const submitSearch = (event) => {
        event.preventDefault();
        const term = query.trim();
        setSearchParams(term ? { q: term } : {});
    };

    return (
        <main className="search-page shop-page">
            <section className="search-panel">
                <p>THE ATELIER SEARCH</p>
                <h1>Search</h1>
                <form className="search-form" onSubmit={submitSearch}>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="SEARCH THE COLLECTION"
                        aria-label="Search the collection"
                        autoFocus
                        maxLength={100}
                    />
                    <span className="search-character-count">{query.length}/100</span>
                    <button type="submit">SEARCH</button>
                </form>
            </section>

            <section className="shop-products search-results">
                {loading ? (
                    <div className="loading-state">Loading collection...</div>
                ) : query.trim() ? (
                    <>
                        <p className="search-result-count">{results.length} results</p>
                        <ProductGrid products={results} />
                    </>
                ) : (
                    <div className="empty-results">Enter a product name to search the collection.</div>
                )}
            </section>
        </main>
    );
}
