import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

const getCurrentUser = () => {
    try {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    } catch {
        return null;
    }
};

const getCartKey = (user) => {
    if (!user?.email) return null;

    return `cart_${user.email.trim().toLowerCase()}`;
};

const loadCart = (user) => {
    const cartKey = getCartKey(user);

    if (!cartKey) return [];

    try {
        const saved = localStorage.getItem(cartKey);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        localStorage.removeItem(cartKey);

        return [];
    }
};

export function CartProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

    const [cart, setCart] = useState(() => {
        const user = getCurrentUser();

        return loadCart(user);
    });

    useEffect(() => {
        const handleAuthChange = () => {
            const user = getCurrentUser();

            setCurrentUser(user);
            setCart(loadCart(user));
        };

        window.addEventListener("authchange", handleAuthChange);

        return () => {
            window.removeEventListener("authchange", handleAuthChange);
        };
    }, []);

    useEffect(() => {
        const cartKey = getCartKey(currentUser);

        if (!cartKey) return;

        localStorage.setItem(cartKey, JSON.stringify(cart));
    }, [cart, currentUser]);

    const addToCart = (
        product,
        quantity = 1,
        size = product.sizes?.[0],
        color = product.colors?.[0]
    ) =>
        setCart((current) => {
            const existing = current.find(
                (item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color
            );

            if (existing)
                return current.map((item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );

            return [...current, { ...product, quantity, size, color }];
        });

    const updateQuantity = (id, size, color, quantity) => {
        if (quantity < 1) {
            removeFromCart(id, size, color);

            return;
        }

        setCart((current) =>
            current.map((item) =>
                item.id === id &&
                item.size === size &&
                item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const removeFromCart = (id, size, color) =>
        setCart((current) =>
            current.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.size === size &&
                        item.color === color
                    )
            )
        );

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((t, item) => t + item.quantity, 0);

    const cartTotal = cart.reduce(
        (t, item) => t + item.price * item.quantity,
        0
    );

    const value = useMemo(
        () => ({
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
        }),
        [cart, cartCount, cartTotal]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}