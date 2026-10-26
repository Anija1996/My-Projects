import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import "../styles/cart.css";

const TAX_RATE = 0.05;

export default function Cart() {
    const { cart, cartCount, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const tax = cartTotal * TAX_RATE;
    const shipping = cartTotal >= 300 ? 0 : 20;
    const total = cartTotal + tax + shipping;

    return (
        <main className="cart-page">
            <section className="cart-header">
                <h1>Your Cart</h1>
                <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
            </section>
            {!cart.length ? (
                <section className="empty-cart">
                    <h2>Your bag is currently empty.</h2>
                    <Link to="/products" className="primary-button">SHOP COLLECTION</Link>
                </section>
            ) : (
                <section className="cart-layout">
                    <div className="cart-list">
                        {cart.map(item => <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />)}
                        <button className="clear-cart" onClick={clearCart}>CLEAR BAG</button>
                    </div>
                    <aside className="cart-summary">
                        <h2>SUMMARY</h2>
                        <div>
                            <span>Subtotal</span>
                            <strong>${Math.round(cartTotal * 100) / 100}</strong>
                        </div>
                        <div>
                            <span>Tax estimate (5%)</span>
                            <strong>${Math.round(tax * 100) / 100}</strong>
                        </div>
                        <div>
                            <span>Shipping</span>
                            <strong>{shipping ? `$${Math.round(shipping * 100) / 100}` : "Complimentary"}</strong>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <strong>${Math.round(total * 100) / 100}</strong>
                        </div>
                        <button className="checkout-button" onClick={() => navigate("/delivery")}>CHECKOUT</button>
                        <p>Complimentary global shipping and returns on orders over $300.</p>
                    </aside>
                </section>
            )}
        </main>
    );
}