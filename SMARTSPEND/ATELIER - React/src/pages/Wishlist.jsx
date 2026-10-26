import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productData } from "../data/products";
import ProductCard from "../components/ProductCard";
import { isLoggedIn } from "../utils/auth";
import "../styles/shop.css";

const getWishlistKey = () => {
    try {
        const savedUser = localStorage.getItem("currentUser");
        const user = savedUser ? JSON.parse(savedUser) : null;

        if (!user?.email) return null;

        return `wishlist_${user.email.trim().toLowerCase()}`;
    } catch {
        return null;
    }
};

export default function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const loadWishlist = () => {
            if (!isLoggedIn()) {
                setWishlist([]);
                navigate("/signin", {
                    replace: true,
                    state: { from: "/wishlist" }
                });
                return;
            }

            const wishlistKey = getWishlistKey();

            if (!wishlistKey) {
                setWishlist([]);
                return;
            }

            try {
                const saved = JSON.parse(
                    localStorage.getItem(wishlistKey) || "[]"
                );

                setWishlist(
                    Array.isArray(saved) ? saved : []
                );
            } catch {
                localStorage.removeItem(wishlistKey);
                setWishlist([]);
            }
        };

        loadWishlist();

        window.addEventListener("wishlistchange", loadWishlist);
        window.addEventListener("authchange", loadWishlist);

        return () => {
            window.removeEventListener("wishlistchange", loadWishlist);
            window.removeEventListener("authchange", loadWishlist);
        };
    }, [navigate]);

    const products = productData.filter((product) =>
        wishlist.includes(product.id)
    );

    const removeItem = (id) => {
        const next = wishlist.filter((item) => item !== id);
        const wishlistKey = getWishlistKey();

        setWishlist(next);

        if (!wishlistKey) return;

        localStorage.setItem(
            wishlistKey,
            JSON.stringify(next)
        );

        window.dispatchEvent(
            new Event("wishlistchange")
        );
    };

    if (!isLoggedIn()) return null;

    return (
        <main className="shop-page">
            <section className="shop-header">
                <p>SAVED PIECES</p>
                <h1>Wishlist</h1>
                <span>{products.length} pieces</span>
            </section>

            {products.length ? (
                <section className="shop-products">
                    <div className="row g-4">
                        {products.map((product) => (
                            <div
                                className="col-6 col-md-4 col-lg-3"
                                key={product.id}
                            >
                                <div className="wishlist-item">
                                    <button
                                        className="wishlist-remove"
                                        onClick={() => removeItem(product.id)}
                                        aria-label={`Remove ${product.name}`}
                                    >
                                        ×
                                    </button>

                                    <ProductCard product={product} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="empty-results">
                    <p>Your wishlist is empty.</p>
                    <Link to="/products">SHOP COLLECTION</Link>
                </section>
            )}
        </main>
    );
}