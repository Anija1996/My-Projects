import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Confirm() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const [delivery, setDelivery] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        try {
            const savedDelivery = localStorage.getItem("deliveryDetails");
            const savedDiscount = Number(localStorage.getItem("discount")) || 0;

            setDelivery(savedDelivery ? JSON.parse(savedDelivery) : null);
            setDiscountAmount(savedDiscount);
        } catch {
            setDelivery(null);
            setDiscountAmount(0);
        }
    }, []);

    const subtotal = cart.reduce(
        (total, item) =>
            total + Number(item.price) * (item.quantity || 1), 0
    );

    const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
    const tax = discountedSubtotal * 0.085;
    const shipping = 0;
    const finalTotal = discountedSubtotal + tax + shipping;

    const placeOrder = () => {
        if (!cart.length || !delivery) {
            return;
        }

        let currentUser = null;

        try {
            const savedUser = localStorage.getItem("currentUser");
            currentUser = savedUser ? JSON.parse(savedUser) : null;
        } catch {
            currentUser = null;
        }

        if (!currentUser?.email) {
            navigate("/signin");
            return;
        }

        const ordersKey = `orders_${currentUser.email.trim().toLowerCase()}`;

        const newOrder = {
            id: `AT-${Date.now()}`,
            items: cart,
            subtotal,
            discount: discountAmount,
            tax,
            shipping,
            total: finalTotal,
            delivery,
            status: "Ordered",
            date: new Date().toISOString(),
        };

        try {
            const savedOrders = localStorage.getItem(ordersKey);
            const existingOrders = savedOrders ? JSON.parse(savedOrders) : [];
            const orders = Array.isArray(existingOrders) ? existingOrders : [];

            orders.unshift(newOrder);

            localStorage.setItem(ordersKey, JSON.stringify(orders));
            localStorage.setItem(
                `lastOrder_${currentUser.email.trim().toLowerCase()}`,
                JSON.stringify(newOrder)
            );

            setOrder(newOrder);
            clearCart();

            localStorage.removeItem("deliveryDetails");
            localStorage.removeItem("discount");
            localStorage.removeItem("discountCode");

            setOrderPlaced(true);
        } catch {
            return;
        }
    };

    if (!delivery || (!cart.length && !orderPlaced)) {
        return (
            <main className="bg-white min-vh-100 py-5">
                <div
                    className="container px-3 px-md-4 text-center py-5"
                    style={{ maxWidth: "500px" }}
                >
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle border border-secondary p-3 mb-4">
                        <span className="material-symbols-outlined text-secondary fs-2">
                            shopping_bag
                        </span>
                    </div>
                    <h1
                        className="display-6 fw-normal text-dark mb-3"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Your bag is empty
                    </h1>
                    <p
                        className="text-secondary mb-4"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            letterSpacing: "1.2px",
                        }}
                    >
                        THERE ARE NO ACTIVE PURCHASES TO DISPLAY. PLEASE ADD
                        ITEMS TO YOUR BAG TO PROCEED WITH CHECKOUT.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/products");
                        }}
                        className="btn btn-dark rounded-0 border-0 px-5 py-3 text-white text-decoration-none d-inline-block"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            letterSpacing: "2px",
                            fontSize: "11px",
                        }}
                    >
                        RETURN TO SHOPPING
                    </button>
                </div>
            </main>
        );
    }

    const displayOrder = orderPlaced ? order : null;

    if (orderPlaced && displayOrder) {
        return (
            <main className="bg-white min-vh-100 py-5">
                <div
                    className="container px-3 px-md-4"
                    style={{ maxWidth: "680px" }}
                >
                    <div className="text-center mb-5">
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle border border-dark p-2 mb-3"
                            style={{ width: "44px", height: "44px" }}
                        >
                            <span className="material-symbols-outlined text-dark fs-5">
                                check
                            </span>
                        </div>
                        <h1
                            className="display-6 fw-normal text-dark mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Your order is confirmed
                        </h1>
                        <p
                            className="text-secondary mb-0"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "11px",
                                letterSpacing: "1.2px",
                            }}
                        >
                            Thank you for your purchase. We have received your
                            order and will notify you as soon as it ships.
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center border-top border-secondary-subtle pt-4 pb-3 mb-4">
                        <div>
                            <span
                                className="text-secondary d-block text-uppercase"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "10px",
                                    letterSpacing: "1.5px",
                                }}
                            >
                                ORDER NUMBER
                            </span>
                            <span
                                className="fw-semibold text-dark"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "11px",
                                    letterSpacing: "1.2px",
                                }}
                            >
                                #{displayOrder.id}
                            </span>
                        </div>
                        <div className="text-end">
                            <span
                                className="text-secondary d-block text-uppercase"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "10px",
                                    letterSpacing: "1.5px",
                                }}
                            >
                                DATE
                            </span>
                            <span
                                className="text-secondary"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "11px",
                                    letterSpacing: "1.2px",
                                }}
                            >
                                {new Date(displayOrder.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="bg-body-tertiary border border-secondary-subtle p-4 mb-5">
                        <div className="d-flex gap-3 align-items-start">
                            <span className="material-symbols-outlined text-dark fs-4">
                                local_shipping
                            </span>
                            <div>
                                <h2
                                    className="fs-6 fw-normal text-dark mb-1"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Estimated Delivery
                                </h2>
                                <p
                                    className="text-secondary small mb-0"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "11px",
                                        letterSpacing: "1.2px",
                                    }}
                                >
                                    Arriving between{" "}
                                    <strong className="text-dark fw-semibold">
                                        Oct 28
                                    </strong>{" "}
                                    and{" "}
                                    <strong className="text-dark fw-semibold">
                                        Nov 1
                                    </strong>{" "}
                                    via Standard Shipping.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <h3
                            className="text-secondary text-uppercase mb-3"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "10px",
                                letterSpacing: "1.5px",
                            }}
                        >
                            ORDER SUMMARY
                        </h3>
                        <div className="border-top border-secondary-subtle">
                            {displayOrder.items.map((item, index) => {
                                const quantity = item.quantity || 1;
                                const itemTotal = Number(item.price) * quantity;

                                return (
                                    <div
                                        key={`${item.id}-${item.size}-${item.color}-${index}`}
                                        className="py-4 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center"
                                    >
                                        <div className="d-flex gap-3 align-items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{
                                                    width: "64px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                }}
                                                className="bg-light flex-shrink-0"
                                            />
                                            <div>
                                                <h4
                                                    className="fs-6 fw-normal text-dark mb-1"
                                                    style={{
                                                        fontFamily:
                                                            "'Playfair Display', serif",
                                                    }}
                                                >
                                                    {item.name}
                                                </h4>
                                                <p
                                                    className="text-secondary mb-0"
                                                    style={{
                                                        fontFamily: "'Inter', sans-serif",
                                                        fontSize: "11px",
                                                        letterSpacing: "1.2px",
                                                    }}
                                                >
                                                    Color: {item.color || "Noir"}
                                                </p>
                                                <p
                                                    className="text-secondary mb-0"
                                                    style={{
                                                        fontFamily: "'Inter', sans-serif",
                                                        fontSize: "11px",
                                                        letterSpacing: "1.2px",
                                                    }}
                                                >
                                                    Size: {item.size || "OS"}
                                                </p>
                                                <p
                                                    className="text-secondary mb-0"
                                                    style={{
                                                        fontFamily: "'Inter', sans-serif",
                                                        fontSize: "11px",
                                                        letterSpacing: "1.2px",
                                                    }}
                                                >
                                                    Qty: {quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-dark"
                                            style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: "11px",
                                                letterSpacing: "1.2px",
                                            }}
                                        >
                                            ${itemTotal.toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="pt-4 border-top border-secondary-subtle">
                            <div className="row justify-content-end">
                                <div className="col-12 col-md-6 col-lg-5">
                                    <div
                                        className="d-flex justify-content-between mb-2"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                        }}
                                    >
                                        <span className="text-secondary">Subtotal</span>
                                        <span className="text-dark">
                                            ${displayOrder.subtotal.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    {displayOrder.discount > 0 && (
                                        <div
                                            className="d-flex justify-content-between mb-2"
                                            style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: "11px",
                                                letterSpacing: "1.2px",
                                            }}
                                        >
                                            <span className="text-secondary">Discount</span>
                                            <span className="text-dark">
                                                -${displayOrder.discount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className="d-flex justify-content-between mb-2"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                        }}
                                    >
                                        <span className="text-secondary">Shipping</span>
                                        <span className="text-dark">Complimentary</span>
                                    </div>
                                    <div
                                        className="d-flex justify-content-between mb-3"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                        }}
                                    >
                                        <span className="text-secondary">Taxes</span>
                                        <span className="text-dark">
                                            ${displayOrder.tax.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between border-top border-secondary-subtle pt-3 align-items-center">
                                        <span
                                            className="fw-bold text-dark text-uppercase"
                                            style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: "10px",
                                                letterSpacing: "1.5px",
                                            }}
                                        >
                                            TOTAL
                                        </span>
                                        <span
                                            className="fs-5 fw-semibold text-dark"
                                            style={{
                                                fontFamily: "'Inter', sans-serif",
                                                letterSpacing: "1.2px",
                                            }}
                                        >
                                            ${displayOrder.total.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                navigate("/");
                            }}
                            className="btn btn-dark rounded-0 border-0 px-5 py-3 text-white text-uppercase"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: "2px",
                                fontSize: "11px",
                            }}
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white min-vh-100 py-5">
            <div
                className="container px-3 px-md-4"
                style={{ maxWidth: "680px" }}
            >
                <div className="text-center mb-5">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle border border-dark p-2 mb-3"
                        style={{ width: "44px", height: "44px" }}
                    >
                        <span className="material-symbols-outlined text-dark fs-5">
                            check
                        </span>
                    </div>
                    <h1
                        className="display-6 fw-normal text-dark mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Review Your Order
                    </h1>
                    <p
                        className="text-secondary mb-0"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            letterSpacing: "1.2px",
                        }}
                    >
                        Please review your order before placing it.
                    </p>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top border-secondary-subtle pt-4 pb-3 mb-4">
                    <div>
                        <span
                            className="text-secondary d-block text-uppercase"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "10px",
                                letterSpacing: "1.5px",
                            }}
                        >
                            ORDER NUMBER
                        </span>
                        <span
                            className="fw-semibold text-dark"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "11px",
                                letterSpacing: "1.2px",
                            }}
                        >
                            #ATL-89240-X
                        </span>
                    </div>
                    <div className="text-end">
                        <span
                            className="text-secondary d-block text-uppercase"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "10px",
                                letterSpacing: "1.5px",
                            }}
                        >
                            DATE
                        </span>
                        <span
                            className="text-secondary"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "11px",
                                letterSpacing: "1.2px",
                            }}
                        >
                            {new Date().toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <div className="bg-body-tertiary border border-secondary-subtle p-4 mb-5">
                    <div className="d-flex gap-3 align-items-start">
                        <span className="material-symbols-outlined text-dark fs-4">
                            local_shipping
                        </span>
                        <div>
                            <h2
                                className="fs-6 fw-normal text-dark mb-1"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Estimated Delivery
                            </h2>
                            <p
                                className="text-secondary small mb-0"
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "11px",
                                    letterSpacing: "1.2px",
                                }}
                            >
                                Arriving between{" "}
                                <strong className="text-dark fw-semibold">Oct 28</strong>{" "}
                                and{" "}
                                <strong className="text-dark fw-semibold">Nov 1</strong>{" "}
                                via Standard Shipping.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <h3
                        className="text-secondary text-uppercase mb-3"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "10px",
                            letterSpacing: "1.5px",
                        }}
                    >
                        ORDER SUMMARY
                    </h3>
                    <div className="border-top border-secondary-subtle">
                        {cart.map((item, index) => {
                            const quantity = item.quantity || 1;
                            const itemTotal = Number(item.price) * quantity;

                            return (
                                <div
                                    key={`${item.id}-${item.size}-${item.color}-${index}`}
                                    className="py-4 border-bottom border-secondary-subtle d-flex justify-content-between align-items-center"
                                >
                                    <div className="d-flex gap-3 align-items-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: "64px",
                                                height: "80px",
                                                objectFit: "cover",
                                            }}
                                            className="bg-light flex-shrink-0"
                                        />
                                        <div>
                                            <h4
                                                className="fs-6 fw-normal text-dark mb-1"
                                                style={{ fontFamily: "'Playfair Display', serif" }}
                                            >
                                                {item.name}
                                            </h4>
                                            <p
                                                className="text-secondary mb-0"
                                                style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: "11px",
                                                    letterSpacing: "1.2px",
                                                }}
                                            >
                                                Color: {item.color || "Noir"}
                                            </p>
                                            <p
                                                className="text-secondary mb-0"
                                                style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: "11px",
                                                    letterSpacing: "1.2px",
                                                }}
                                            >
                                                Size: {item.size || "OS"}
                                            </p>
                                            <p
                                                className="text-secondary mb-0"
                                                style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: "11px",
                                                    letterSpacing: "1.2px",
                                                }}
                                            >
                                                Qty: {quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className="text-dark"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                        }}
                                    >
                                        ${itemTotal.toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="pt-4 border-top border-secondary-subtle">
                        <div className="row justify-content-end">
                            <div className="col-12 col-md-6 col-lg-5">
                                <div
                                    className="d-flex justify-content-between mb-2"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "11px",
                                        letterSpacing: "1.2px",
                                    }}
                                >
                                    <span className="text-secondary">Subtotal</span>
                                    <span className="text-dark">
                                        ${subtotal.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                    <div
                                        className="d-flex justify-content-between mb-2"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                        }}
                                    >
                                        <span className="text-secondary">Discount</span>
                                        <span className="text-dark">
                                            -${discountAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div
                                    className="d-flex justify-content-between mb-2"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "11px",
                                        letterSpacing: "1.2px",
                                    }}
                                >
                                    <span className="text-secondary">Shipping</span>
                                    <span className="text-dark">Complimentary</span>
                                </div>
                                <div
                                    className="d-flex justify-content-between mb-3"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "11px",
                                        letterSpacing: "1.2px",
                                    }}
                                >
                                    <span className="text-secondary">Taxes</span>
                                    <span className="text-dark">${tax.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between border-top border-secondary-subtle pt-3 align-items-center">
                                    <span
                                        className="fw-bold text-dark text-uppercase"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "10px",
                                            letterSpacing: "1.5px",
                                        }}
                                    >
                                        TOTAL
                                    </span>
                                    <span
                                        className="fs-5 fw-semibold text-dark"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            letterSpacing: "1.2px",
                                        }}
                                    >
                                        ${finalTotal.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-3">
                    <button
                        type="button"
                        onClick={placeOrder}
                        className="btn btn-dark rounded-0 border-0 px-5 py-3 text-white text-uppercase"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            letterSpacing: "2px",
                            fontSize: "11px",
                        }}
                    >
                        PLACE ORDER
                    </button>
                </div>
            </div>
        </main>
    );
}