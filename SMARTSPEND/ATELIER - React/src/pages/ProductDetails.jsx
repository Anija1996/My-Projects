import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { requireLogin } from "../utils/auth";
import "../styles/product-details.css";

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

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { cart, addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [added, setAdded] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        let active = true;

        setLoading(true);
        setError("");

        getProductById(id)
            .then((data) => {
                if (!active) return;

                if (!data) {
                    setError("Product not found.");
                    setProduct(null);
                    return;
                }

                setProduct(data);
                setSize(data.sizes?.[0] || "");
                setColor(data.colors?.[0] || "");
            })
            .catch(() => {
                if (active) {
                    setProduct(null);
                    setError(
                        "We couldn't load this product right now. Please try again."
                    );
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    useEffect(() => {
        const checkWishlist = () => {
            const wishlistKey = getWishlistKey();

            if (!wishlistKey || !product) {
                setInWishlist(false);
                return;
            }

            try {
                const saved = JSON.parse(
                    localStorage.getItem(wishlistKey) || "[]"
                );

                setInWishlist(
                    Array.isArray(saved) &&
                        saved.some(
                            (item) =>
                                String(item) === String(product.id)
                        )
                );
            } catch {
                setInWishlist(false);
            }
        };

        checkWishlist();

        window.addEventListener("wishlistchange", checkWishlist);
        window.addEventListener("authchange", checkWishlist);

        return () => {
            window.removeEventListener(
                "wishlistchange",
                checkWishlist
            );
            window.removeEventListener(
                "authchange",
                checkWishlist
            );
        };
    }, [product]);

    if (loading) {
        return (
            <main className="loading-page">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p>Loading product...</p>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="loading-page">
                <p>{error || "Product not found."}</p>

                <Link to="/products">
                    BACK TO SHOP
                </Link>
            </main>
        );
    }

    const detailPrice = product.price;
    const mainImage = product.image;
    const thumbnails = [mainImage];

    const isInCart = cart.some(
        (item) => String(item.id) === String(product.id)
    );

    const handleAdd = () => {
        if (!requireLogin(navigate, `/products/${product.id}`)) {
            return;
        }

        if (isInCart) {
            navigate("/cart");
            return;
        }

        addToCart(
            {
                ...product,
                price: detailPrice,
            },
            quantity,
            size,
            color
        );

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 1800);
    };

    const handleWishlist = () => {
        if (!requireLogin(navigate, `/products/${product.id}`)) {
            return;
        }

        const wishlistKey = getWishlistKey();

        if (!wishlistKey) {
            return;
        }

        try {
            const saved = JSON.parse(
                localStorage.getItem(wishlistKey) || "[]"
            );

            const wishlist = Array.isArray(saved) ? saved : [];

            const productId = String(product.id);

            const exists = wishlist.some(
                (item) => String(item) === productId
            );

            if (exists) {
                const updated = wishlist.filter(
                    (item) => String(item) !== productId
                );

                localStorage.setItem(
                    wishlistKey,
                    JSON.stringify(updated)
                );

                setInWishlist(false);
            } else {
                localStorage.setItem(
                    wishlistKey,
                    JSON.stringify([
                        ...wishlist,
                        product.id,
                    ])
                );

                setInWishlist(true);
            }

            window.dispatchEvent(
                new Event("wishlistchange")
            );
        } catch {
            setInWishlist(false);
        }
    };

    return (
        <main className="product-view-page">
            <section className="mobile-product-section d-sm-none">
                <div className="mobile-main-image">
                    <img
                        src={mainImage}
                        alt={product.name}
                    />
                </div>

                <div className="mobile-dots">
                    <span className="active" />
                    <span />
                    <span />
                </div>

                <div className="mobile-product-details">
                    <div className="mobile-product-heading">
                        <div>
                            <h1>
                                {product.name.toUpperCase()}
                            </h1>

                            <div>
                                Quiet Luxury Collection
                            </div>
                        </div>

                        <span>
                            ${detailPrice.toLocaleString()}
                        </span>
                    </div>

                    <hr />

                    <div className="mobile-color-section">
                        <div className="mobile-label">
                            COLOR: {color}
                        </div>

                        <div className="color-list">
                            {(product.colors || []).map((item) => (
                                <button
                                    key={item}
                                    className={`color-circle ${
                                        item.toLowerCase()
                                    } ${
                                        color === item
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setColor(item)
                                    }
                                    aria-label={item}
                                />
                            ))}
                        </div>
                    </div>

                    <hr />

                    <div className="mobile-size-section">
                        <div className="mobile-size-heading">
                            <div className="mobile-label">
                                SIZE
                            </div>

                            <span>SIZE GUIDE</span>
                        </div>

                        <div className="mobile-size-grid">
                            {(product.sizes || [])
                                .slice(0, 4)
                                .map((item) => (
                                    <button
                                        key={item}
                                        className={
                                            size === item
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSize(item)
                                        }
                                    >
                                        {item.replace(
                                            "EU ",
                                            ""
                                        )}
                                    </button>
                                ))}
                        </div>
                    </div>

                    <button
                        className="mobile-cart-button"
                        onClick={handleAdd}
                    >
                        {isInCart
                            ? "IN CART · VIEW CART"
                            : `ADD TO CART · $${detailPrice.toLocaleString()}`}
                    </button>

                    {added && (
                        <div className="cart-message">
                            ADDED TO CART
                        </div>
                    )}

                    <button
                        className="wishlist-detail"
                        onClick={handleWishlist}
                    >
                        {inWishlist
                            ? "♥ IN WISHLIST"
                            : "♡ SAVE TO WISHLIST"}
                    </button>

                    <details>
                        <summary>
                            DESCRIPTION <span>⌄</span>
                        </summary>

                        <p>{product.description}</p>
                    </details>

                    <details>
                        <summary>
                            DETAILS &amp; CARE <span>⌄</span>
                        </summary>

                        <p>
                            Lightweight construction with
                            structured tailoring. Dry clean
                            recommended.
                        </p>
                    </details>

                    <details>
                        <summary>
                            SHIPPING &amp; RETURNS{" "}
                            <span>⌄</span>
                        </summary>

                        <p>
                            Complimentary shipping and easy
                            returns within 14 days.
                        </p>
                    </details>
                </div>
            </section>

            <section className="desktop-product-section d-none d-sm-block">
                <div className="container">
                    <div className="product-path">
                        <Link to="/">
                            HOME
                        </Link>

                        <span>/</span>

                        <Link to="/products">
                            SHOP
                        </Link>

                        <span>/</span>

                        <span>
                            {product.name.toUpperCase()}
                        </span>
                    </div>

                    <div className="product-details-row">
                        <div className="product-gallery">
                            <div className="product-thumbnails">
                                {thumbnails.map(
                                    (image, index) => (
                                        <img
                                            key={image}
                                            src={image}
                                            className={
                                                index === 0
                                                    ? "active"
                                                    : ""
                                            }
                                            alt={product.name}
                                        />
                                    )
                                )}
                            </div>

                            <div className="product-main-image-wrapper">
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="main-product-img"
                                />
                            </div>
                        </div>

                        <div className="product-info">
                            <h2>
                                {product.name.toUpperCase()}
                            </h2>

                            <span className="product-price">
                                $
                                {detailPrice.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </span>

                            <div className="detail-color-label">
                                COLOR: {color}
                            </div>

                            <div className="color-list">
                                {(product.colors || []).map(
                                    (item) => (
                                        <button
                                            key={item}
                                            className={`color-circle ${
                                                item.toLowerCase()
                                            } ${
                                                color === item
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setColor(item)
                                            }
                                            aria-label={item}
                                        />
                                    )
                                )}
                            </div>

                            <hr />

                            <div className="size-heading">
                                <strong>
                                    SIZE: {size}
                                </strong>

                                <span>
                                    SIZE GUIDE
                                </span>
                            </div>

                            <div className="size-grid">
                                {(product.sizes || []).map(
                                    (item) => (
                                        <button
                                            key={item}
                                            className={
                                                size === item
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setSize(item)
                                            }
                                        >
                                            {item.replace(
                                                "EU ",
                                                ""
                                            )}
                                        </button>
                                    )
                                )}
                            </div>

                            <div className="detail-actions">
                                <div className="quantity-detail">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(
                                                    1,
                                                    quantity - 1
                                                )
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="add-to-cart-detail"
                                    onClick={handleAdd}
                                >
                                    {isInCart
                                        ? "IN CART · VIEW CART"
                                        : "ADD TO CART"}
                                </button>

                                {added && (
                                    <div className="cart-message">
                                        ADDED TO CART
                                    </div>
                                )}

                                <button
                                    className="wishlist-detail"
                                    onClick={handleWishlist}
                                >
                                    {inWishlist
                                        ? "♥ IN WISHLIST"
                                        : "♡ SAVE TO WISHLIST"}
                                </button>
                            </div>

                            <details>
                                <summary>
                                    DESCRIPTION{" "}
                                    <span>⌄</span>
                                </summary>

                                <p>
                                    {product.description}
                                </p>
                            </details>

                            <details>
                                <summary>
                                    DETAILS &amp; FIT{" "}
                                    <span>⌄</span>
                                </summary>

                                <p>
                                    Lightweight construction
                                    with structured shoulders
                                    and relaxed tailoring.
                                </p>
                            </details>

                            <details>
                                <summary>
                                    SHIPPING &amp; RETURNS{" "}
                                    <span>⌄</span>
                                </summary>

                                <p>
                                    Complimentary shipping
                                    and easy returns within
                                    14 days.
                                </p>
                            </details>

                            <button
                                className="back-to-shop"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                BACK TO SHOP
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}