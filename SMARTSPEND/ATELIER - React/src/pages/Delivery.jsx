import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/checkout.css";

export default function Delivery() {
    const navigate = useNavigate();
    const { cart } = useCart();

    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        postal: "",
    });

    const [errors, setErrors] = useState({});
    const [discount, setDiscount] = useState(0);
    const [discountCode, setDiscountCode] = useState("");
    const [discountInput, setDiscountInput] = useState("");

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        validateField(field, value);
    };

    const validateField = (field, value = form[field]) => {
        let message = "";

        if (field === "email") {
            if (value.trim().length === 0) {
                message = "Please enter your email address";
            } else if (
                !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    value.trim()
                )
            ) {
                message = "Invalid email format";
            }
        }

        if (field === "firstName") {
            if (value.trim().length === 0) {
                message = "Please enter your first name";
            } else if (value.trim().length < 3) {
                message = "Minimum 3 characters required";
            }
        }

        if (field === "lastName") {
            if (value.trim().length === 0) {
                message = "Please enter your last name";
            } else if (value.trim().length < 3) {
                message = "Minimum 3 characters required";
            }
        }

        if (field === "street") {
            if (value.trim().length === 0) {
                message = "Please enter your street address";
            }
        }

        if (field === "city") {
            if (value.trim().length === 0) {
                message = "Please enter your city";
            }
        }

        if (field === "postal") {
            if (value.trim().length === 0) {
                message = "Please enter your postal code";
            } else if (!/^[0-9]{4,10}$/.test(value.trim())) {
                message = "Invalid postal code";
            }
        }

        setErrors((current) => ({
            ...current,
            [field]: message,
        }));

        return message === "";
    };

    const validateForm = () => {
        const fields = Object.keys(form);
        let valid = true;

        fields.forEach((field) => {
            if (!validateField(field, form[field])) {
                valid = false;
            }
        });

        return valid;
    };

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => {
            const quantity = item.quantity || 1;

            return total + Number(item.price) * quantity;
        }, 0);
    };

    const calculateDiscount = (code) => {
        const subtotal = calculateSubtotal();

        if (code === "ATELIER10") {
            return (subtotal * 10) / 100;
        }

        if (code === "ATELIER20") {
            return (subtotal * 20) / 100;
        }

        return 0;
    };

    const applyDiscount = () => {
        const code = discountInput.trim().toUpperCase();

        setDiscountCode(code);
        setDiscount(calculateDiscount(code));
    };

    const subtotal = calculateSubtotal();

    const discountedSubtotal = Math.max(
        subtotal - discount,
        0
    );

    const submit = (e) => {
        e.preventDefault();

        if (!cart.length) {
            return;
        }

        if (validateForm()) {
            localStorage.setItem(
                "deliveryEmail",
                form.email.trim()
            );

            localStorage.setItem(
                "deliveryFirstName",
                form.firstName.trim()
            );

            localStorage.setItem(
                "deliveryLastName",
                form.lastName.trim()
            );

            localStorage.setItem(
                "deliveryStreet",
                form.street.trim()
            );

            localStorage.setItem(
                "deliveryCity",
                form.city.trim()
            );

            localStorage.setItem(
                "deliveryPostal",
                form.postal.trim()
            );

            localStorage.setItem(
                "discount",
                discount
            );

            localStorage.setItem(
                "discountCode",
                discountCode
            );

            localStorage.setItem(
                "deliveryDetails",
                JSON.stringify({
                    ...form,
                    email: form.email.trim(),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    street: form.street.trim(),
                    city: form.city.trim(),
                    postal: form.postal.trim(),
                })
            );

            navigate("/confirm");
        }
    };

    return (
        <main className="flex-grow-1 py-4 py-lg-5">
            <div className="container px-3 px-md-4 px-lg-5">
                <div className="row g-4 g-lg-5">
                    <div className="col-12 col-lg-7 col-xl-8">
                        <section className="mb-5">
                            <h2 className="font-serif fs-4 fw-normal text-dark mb-4">
                                <span className="text-secondary-subtle me-2">
                                    01
                                </span>
                                Delivery Address
                            </h2>

                            <form
                                id="delivery-form"
                                noValidate
                                onSubmit={submit}
                            >
                                <div className="mb-3">
                                    <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                        EMAIL ADDRESS
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control rounded-0 shadow-none bg-body-tertiary border border-secondary-subtle p-2 font-sans text-dark ${
                                            errors.email
                                                ? "is-invalid"
                                                : form.email
                                                ? "is-valid"
                                                : ""
                                        }`}
                                        placeholder="Email ID"
                                        value={form.email}
                                        onChange={(e) =>
                                            updateField(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div
                                        id="email-error"
                                        className="text-danger font-sans small mt-1"
                                    >
                                        {errors.email}
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                            FIRST NAME
                                        </label>

                                        <input
                                            type="text"
                                            id="firstName"
                                            className={`form-control rounded-0 shadow-none bg-body-tertiary border border-secondary-subtle p-2 font-sans text-dark ${
                                                errors.firstName
                                                    ? "is-invalid"
                                                    : form.firstName
                                                    ? "is-valid"
                                                    : ""
                                            }`}
                                            placeholder="First Name"
                                            value={form.firstName}
                                            onChange={(e) =>
                                                updateField(
                                                    "firstName",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div
                                            id="firstName-error"
                                            className="text-danger font-sans small mt-1"
                                        >
                                            {errors.firstName}
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                            LAST NAME
                                        </label>

                                        <input
                                            type="text"
                                            id="lastName"
                                            className={`form-control rounded-0 shadow-none bg-body-tertiary border border-secondary-subtle p-2 font-sans text-dark ${
                                                errors.lastName
                                                    ? "is-invalid"
                                                    : form.lastName
                                                    ? "is-valid"
                                                    : ""
                                            }`}
                                            placeholder="Last Name"
                                            value={form.lastName}
                                            onChange={(e) =>
                                                updateField(
                                                    "lastName",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div
                                            id="lastName-error"
                                            className="text-danger font-sans small mt-1"
                                        >
                                            {errors.lastName}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                        STREET ADDRESS
                                    </label>

                                    <input
                                        type="text"
                                        id="street"
                                        className={`form-control rounded-0 shadow-none bg-body-tertiary border border-secondary-subtle p-2 font-sans text-dark ${
                                            errors.street
                                                ? "is-invalid"
                                                : form.street
                                                ? "is-valid"
                                                : ""
                                        }`}
                                        placeholder="Apt, Suite, Street"
                                        value={form.street}
                                        onChange={(e) =>
                                            updateField(
                                                "street",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div
                                        id="street-error"
                                        className="text-danger font-sans small mt-1"
                                    >
                                        {errors.street}
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                            CITY
                                        </label>

                                        <input
                                            type="text"
                                            id="city"
                                            className={`form-control rounded-0 shadow-none bg-body-tertiary border border-secondary-subtle p-2 font-sans text-dark ${
                                                errors.city
                                                    ? "is-invalid"
                                                    : form.city
                                                    ? "is-valid"
                                                    : ""
                                            }`}
                                            placeholder="City"
                                            value={form.city}
                                            onChange={(e) =>
                                                updateField(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div
                                            id="city-error"
                                            className="text-danger font-sans small mt-1"
                                        >
                                            {errors.city}
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                            POSTAL CODE
                                        </label>

                                        <input
                                            type="text"
                                            id="postal"
                                            className={`form-control rounded-0 shadow-none bg-body-tertiary border border-secondary-subtle p-2 font-sans text-dark ${
                                                errors.postal
                                                    ? "is-invalid"
                                                    : form.postal
                                                    ? "is-valid"
                                                    : ""
                                            }`}
                                            placeholder="ZIP / Postal"
                                            value={form.postal}
                                            onChange={(e) =>
                                                updateField(
                                                    "postal",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div
                                            id="postal-error"
                                            className="text-danger font-sans small mt-1"
                                        >
                                            {errors.postal}
                                        </div>
                                    </div>
                                </div>

                                {!cart.length && (
                                    <div className="border border-warning rounded text-warning p-2 mt-3 text-center fw-bold">
                                        Your cart is empty. Please add items before checking out.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-dark font-serif rounded-0 border-0 w-100 py-3 text-white mt-3"
                                    disabled={!cart.length}
                                >
                                    CONTINUE TO PAYMENT
                                </button>
                            </form>
                        </section>

                        <section className="mb-5">
                            <h2 className="font-serif fs-4 fw-normal text-secondary-subtle mb-3">
                                <span className="me-2">02</span>
                                Payment Method
                            </h2>

                            <div className="bg-body-tertiary border border-secondary-subtle p-3 d-flex justify-content-between align-items-center text-secondary-subtle font-sans">
                                <span>Credit Card</span>

                                <span className="material-symbols-outlined fs-5 align-middle">
                                    credit_card
                                </span>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-serif fs-4 fw-normal text-secondary-subtle">
                                <span className="me-2">03</span>
                                Order Review
                            </h2>
                        </section>
                    </div>

                    <div className="col-12 col-lg-5 col-xl-4">
                        <aside className="order-summary-box bg-body-tertiary border border-secondary-subtle p-4 rounded-0 sticky-lg-top">
                            <h3 className="font-serif fs-5 fw-normal text-dark mb-4">
                                Order Summary
                            </h3>

                            <div className="mb-4" id="summary-items">
                                {cart.length === 0 ? (
                                    <div className="text-center py-3">
                                        <span className="material-symbols-outlined text-secondary fs-3">
                                            shopping_bag
                                        </span>

                                        <p className="font-inter small text-secondary mb-0">
                                            Your cart is currently empty
                                        </p>
                                    </div>
                                ) : (
                                    cart.map((item) => {
                                        const quantity =
                                            item.quantity || 1;

                                        const itemTotal =
                                            Number(item.price) *
                                            quantity;

                                        return (
                                            <div
                                                className="d-flex gap-3 mb-3"
                                                key={`${item.id}-${item.size}-${item.color}`}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="summary-item-image flex-shrink-0"
                                                />

                                                <div className="flex-grow-1">
                                                    <div className="summary-item-name small">
                                                        {item.name}
                                                    </div>

                                                    <div className="summary-item-details">
                                                        Color:{" "}
                                                        {item.color ||
                                                            "Noir"}
                                                    </div>

                                                    <div className="summary-item-details">
                                                        Size:{" "}
                                                        {item.size ||
                                                            "OS"}
                                                    </div>

                                                    <div className="summary-item-details">
                                                        Qty: {quantity}
                                                    </div>
                                                </div>

                                                <div className="summary-item-price">
                                                    $
                                                    {itemTotal.toFixed(
                                                        2
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="font-serif fw-bold text-secondary mb-1 d-block">
                                    DISCOUNT CODE
                                </label>

                                <div className="d-flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        id="discount"
                                        className="form-control rounded-0 shadow-none bg-white border border-secondary-subtle p-2 font-sans text-dark"
                                        placeholder="Enter code"
                                        value={discountInput}
                                        onChange={(e) =>
                                            setDiscountInput(
                                                e.target.value
                                            )
                                        }
                                        disabled={!cart.length}
                                    />

                                    <button
                                        type="button"
                                        id="apply-discount"
                                        className="btn btn-outline-dark font-serif rounded-0 border-dark px-3 text-dark"
                                        onClick={applyDiscount}
                                        disabled={!cart.length}
                                    >
                                        APPLY
                                    </button>
                                </div>
                            </div>

                            <div className="border-top border-secondary-subtle pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="font-sans text-secondary">
                                        Subtotal
                                    </span>

                                    <span className="font-sans text-secondary">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="font-sans text-secondary">
                                        Discount
                                    </span>

                                    <span className="font-sans text-secondary">
                                        {discount > 0
                                            ? `-$${discount.toFixed(2)}`
                                            : "$0.00"}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="font-sans text-secondary">
                                        Shipping
                                    </span>

                                    <span className="font-sans text-secondary">
                                        Complimentary
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between border-top border-secondary-subtle pt-3 align-items-center">
                                    <span className="font-serif text-dark fs-6">
                                        Total
                                    </span>

                                    <span className="font-sans fs-5 fw-semibold text-dark">
                                        ${discountedSubtotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
}