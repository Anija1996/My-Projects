import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/profile.css";

const getOrdersKey = (user) => {
    if (!user?.email) return null;

    return `orders_${user.email.trim().toLowerCase()}`;
};

export default function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("currentUser");
            const currentUser = savedUser
                ? JSON.parse(savedUser)
                : null;

            setUser(currentUser);

            const ordersKey = getOrdersKey(currentUser);

            if (!ordersKey) {
                setOrders([]);
                return;
            }

            const savedOrders = localStorage.getItem(ordersKey);
            const parsedOrders = savedOrders
                ? JSON.parse(savedOrders)
                : [];

            setOrders(
                Array.isArray(parsedOrders)
                    ? parsedOrders
                    : []
            );
        } catch {
            setUser(null);
            setOrders([]);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("currentUser");
        window.dispatchEvent(new Event("authchange"));
        navigate("/signin");
    };

    if (!user) {
        return (
            <main className="profile-page profile-guest">
                <h1>Your Account</h1>
                <p>Please sign in to view your account.</p>
                <Link to="/signin" className="primary-button">
                    SIGN IN
                </Link>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-mobile-header">
                <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    ←
                </button>
                <h1>My Account</h1>
            </div>

            <section className="profile-desktop-header">
                <h1>My Account</h1>
                <p>
                    Welcome back, {user.name}. Manage your orders and
                    preferences here.
                </p>
            </section>

            <section className="profile-mobile-user">
                <div className="profile-avatar">
                    <span className="material-symbols-outlined">
                        person
                    </span>
                </div>
                <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            </section>

            <section className="profile-layout">
                <aside className="profile-sidebar">
                    <Link
                        to="/profile"
                        className="profile-sidebar-link"
                    >
                        PROFILE DETAILS
                    </Link>
                    <Link
                        to="/profile"
                        className="profile-sidebar-link active"
                    >
                        ORDER HISTORY
                    </Link>
                    <Link
                        to="/wishlist"
                        className="profile-sidebar-link"
                    >
                        WISHLIST
                    </Link>
                    <button
                        type="button"
                        className="profile-sidebar-link profile-signout"
                        onClick={logout}
                    >
                        SIGN OUT
                    </button>
                </aside>

                <div className="profile-main">
                    <div className="profile-mobile-menu">
                        <Link
                            to="/profile"
                            className="profile-menu-card"
                        >
                            <span className="material-symbols-outlined">
                                manage_accounts
                            </span>
                            <strong>PROFILE DETAILS</strong>
                            <span className="profile-menu-arrow">
                                ›
                            </span>
                        </Link>

                        <Link
                            to="/profile"
                            className="profile-menu-card active"
                        >
                            <span className="material-symbols-outlined">
                                history
                            </span>
                            <strong>ORDER HISTORY</strong>
                            <span className="profile-menu-arrow">
                                ›
                            </span>
                        </Link>

                        <Link
                            to="/wishlist"
                            className="profile-menu-card"
                        >
                            <span className="material-symbols-outlined">
                                favorite_border
                            </span>
                            <strong>WISHLIST</strong>
                            <span className="profile-menu-arrow">
                                ›
                            </span>
                        </Link>
                    </div>

                    <div className="profile-order-section">
                        <div className="profile-order-heading">
                            <h2>Order History</h2>
                            <span>
                                {orders.length}{" "}
                                {orders.length === 1
                                    ? "ORDER"
                                    : "ORDERS"}
                            </span>
                        </div>

                        <div className="profile-orders">
                            {orders.length === 0 ? (
                                <div className="profile-no-orders">
                                    <h3>No orders yet</h3>
                                    <p>
                                        You haven't placed any orders yet.
                                    </p>
                                    <Link
                                        to="/products"
                                        className="primary-button"
                                    >
                                        SHOP NOW
                                    </Link>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <section
                                        className="profile-order-group"
                                        key={order.id}
                                    >
                                        <div className="profile-order-number">
                                            <span>
                                                ORDER #{order.id}
                                            </span>
                                            <span>
                                                {order.status || "Ordered"}
                                            </span>
                                        </div>

                                        {order.items?.map((item, index) => (
                                            <article
                                                className="profile-order-card"
                                                key={`${order.id}-${item.id}-${item.size}-${item.color}-${index}`}
                                            >
                                                <div className="profile-order-image">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <div />
                                                    )}
                                                </div>

                                                <div className="profile-order-details">
                                                    <div className="profile-order-top">
                                                        <div>
                                                            <h3>
                                                                {item.name}
                                                            </h3>

                                                            {item.color && (
                                                                <p>
                                                                    Color:{" "}
                                                                    {item.color}
                                                                    {item.size && (
                                                                        <>
                                                                            {" | "}
                                                                            Size:{" "}
                                                                            {item.size}
                                                                        </>
                                                                    )}
                                                                </p>
                                                            )}

                                                            <p>
                                                                Quantity:{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>

                                                        <strong>
                                                            $
                                                            {Math.round(
                                                                item.price *
                                                                    item.quantity *
                                                                    100
                                                            ) / 100}
                                                        </strong>
                                                    </div>

                                                    <div className="profile-order-bottom">
                                                        <span>
                                                            {new Date(
                                                                order.date
                                                            ).toLocaleDateString()}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/order/${order.id}`
                                                                )
                                                            }
                                                        >
                                                            VIEW INVOICE
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </section>
                                ))
                            )}
                        </div>
                    </div>

                    <section className="profile-mobile-recent">
                        <h2>Recent Orders</h2>

                        <div className="profile-recent-list">
                            {orders.length === 0 ? (
                                <p className="profile-no-recent-orders">
                                    No recent orders.
                                </p>
                            ) : (
                                orders
                                    .slice(0, 2)
                                    .map((order) => {
                                        const firstItem = order.items?.[0];

                                        return (
                                            <article
                                                className="profile-recent-order"
                                                key={order.id}
                                            >
                                                <div className="profile-recent-image">
                                                    {firstItem?.image && (
                                                        <img
                                                            src={firstItem.image}
                                                            alt={firstItem.name}
                                                        />
                                                    )}
                                                </div>

                                                <div className="profile-recent-info">
                                                    <strong>
                                                        Order #{order.id}
                                                    </strong>
                                                    <p>
                                                        {firstItem?.name ||
                                                            "Order"}
                                                    </p>
                                                </div>

                                                <span className="profile-status">
                                                    {order.status ||
                                                        "Ordered"}
                                                </span>
                                            </article>
                                        );
                                    })
                            )}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
}