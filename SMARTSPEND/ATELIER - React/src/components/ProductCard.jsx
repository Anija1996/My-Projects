import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { requireLogin } from "../utils/auth";

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

export default function ProductCard({ product }) {
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const checkWishlist = () => {
            const wishlistKey = getWishlistKey();

            if (!wishlistKey) {
                setSaved(false);
                return;
            }

            try {
                const wishlist = JSON.parse(
                    localStorage.getItem(wishlistKey) || "[]"
                );

                setSaved(
                    Array.isArray(wishlist) &&
                    wishlist.includes(product.id)
                );
            } catch {
                setSaved(false);
            }
        };

        checkWishlist();
        window.addEventListener("wishlistchange", checkWishlist);
        window.addEventListener("authchange", checkWishlist);

        return () => {
            window.removeEventListener("wishlistchange", checkWishlist);
            window.removeEventListener("authchange", checkWishlist);
        };
    }, [product.id]);

    useEffect(() => {
        const isAdded = cart.some(
            (item) => String(item.id) === String(product.id)
        );

        setAddedToCart(isAdded);
    }, [cart, product.id]);

    const handleAddToBag = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!requireLogin(navigate, `/products/${product.id}`)) {
            return;
        }

        const alreadyInCart = cart.some(
            (item) => String(item.id) === String(product.id)
        );

        if (alreadyInCart) {
            return;
        }

        addToCart(product);
        setAddedToCart(true);
    };

    const handleWishlist = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!requireLogin(navigate, `/products/${product.id}`)) {
            return;
        }

        const wishlistKey = getWishlistKey();

        if (!wishlistKey) return;

        try {
            const wishlist = JSON.parse(
                localStorage.getItem(wishlistKey) || "[]"
            );

            const current = Array.isArray(wishlist)
                ? wishlist
                : [];

            const next = current.includes(product.id)
                ? current.filter((id) => id !== product.id)
                : [...current, product.id];

            localStorage.setItem(
                wishlistKey,
                JSON.stringify(next)
            );

            setSaved(next.includes(product.id));

            window.dispatchEvent(
                new Event("wishlistchange")
            );
        } catch {
            setSaved(false);
        }
    };

    return (
        <article className="product-card">
            <div className="product-card-image-wrap">
                <Link
                    to={`/products/${product.id}`}
                    className="text-decoration-none text-dark product-card-link"
                >
                    <div className="product-image">
                        <img
                            src={product.image}
                        />

                        {product.newProduct && (
                            <span className="new-badge">
                                NEW
                            </span>
                        )}
                    </div>
                </Link>

                <button
                    type="button"
                    className="product-wishlist-btn"
                    onClick={handleWishlist}
                    aria-label={
                        saved
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    <span
                        className={`material-symbols-outlined ${
                            saved ? "wishlist-filled" : ""
                        }`}
                    >
                        {saved ? "favorite" : "favorite_border"}
                    </span>
                </button>
            </div>

            <Link
                to={`/products/${product.id}`}
                className="text-decoration-none text-dark product-card-info-link"
            >
                <div className="product-info">
                    <p className="product-name">
                        {product.name}
                    </p>

                    <p className="product-price">
                        ${product.price}
                    </p>
                </div>
            </Link>

            <button
                className="product-quick-add"
                onClick={handleAddToBag}
            >
                {addedToCart
                    ? "ITEM ADDED TO CART"
                    : "ADD TO BAG"}
            </button>
        </article>
    );
}