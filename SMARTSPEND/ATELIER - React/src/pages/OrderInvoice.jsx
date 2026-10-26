import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/profile.css";

const getOrdersKey = (user) => {
    if (!user?.email) return null;

    return `orders_${user.email.trim().toLowerCase()}`;
};

export default function OrderInvoice() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("currentUser");
            const user = savedUser
                ? JSON.parse(savedUser)
                : null;

            const ordersKey = getOrdersKey(user);

            if (!ordersKey) {
                setOrder(null);
                return;
            }

            const savedOrders = localStorage.getItem(ordersKey);
            const orders = savedOrders
                ? JSON.parse(savedOrders)
                : [];

            const foundOrder = Array.isArray(orders)
                ? orders.find(
                    (item) => String(item.id) === String(id)
                )
                : null;

            setOrder(foundOrder || null);
        } catch {
            setOrder(null);
        }
    }, [id]);

    if (!order) {
        return (
            <main className="profile-page profile-guest">
                <h1>Order Not Found</h1>
                <p>
                    We couldn't find the requested order.
                </p>
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/profile")}
                >
                    BACK TO MY ACCOUNT
                </button>
            </main>
        );
    }

    const total = order.items?.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    ) || 0;

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

                <h1>Invoice</h1>
            </div>

            <section className="profile-desktop-header">
                <h1>Order Invoice</h1>
                <p>
                    Thank you for your order.
                </p>
            </section>

            <section className="invoice-page">
                <div className="invoice-header">
                    <div>
                        <h2>ATELIER</h2>
                        <p>ORDER INVOICE</p>
                    </div>

                    <div className="invoice-order-info">
                        <strong>
                            ORDER #{order.id}
                        </strong>

                        <span>
                            {order.date
                                ? new Date(
                                    order.date
                                ).toLocaleDateString()
                                : ""}
                        </span>

                        <span>
                            {order.status || "Ordered"}
                        </span>
                    </div>
                </div>

                <div className="invoice-divider" />

                <div className="invoice-items">
                    {order.items?.map((item, index) => (
                        <article
                            className="invoice-item"
                            key={`${order.id}-${item.id}-${item.size}-${item.color}-${index}`}
                        >
                            <div className="invoice-item-image">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />
                                ) : (
                                    <div />
                                )}
                            </div>

                            <div className="invoice-item-details">
                                <h3>
                                    {item.name}
                                </h3>

                                {item.color && (
                                    <p>
                                        Color: {item.color}
                                    </p>
                                )}

                                {item.size && (
                                    <p>
                                        Size: {item.size}
                                    </p>
                                )}

                                <p>
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <strong className="invoice-item-price">
                                $
                                {Math.round(
                                    item.price *
                                        item.quantity *
                                        100
                                ) / 100}
                            </strong>
                        </article>
                    ))}
                </div>

                <div className="invoice-divider" />

                <div className="invoice-total">
                    <span>TOTAL</span>

                    <strong>
                        $
                        {Math.round(
                            total * 100
                        ) / 100}
                    </strong>
                </div>

                <div className="invoice-actions">
                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => navigate("/profile")}
                    >
                        BACK TO MY ACCOUNT
                    </button>
                </div>
            </section>
        </main>
    );
}