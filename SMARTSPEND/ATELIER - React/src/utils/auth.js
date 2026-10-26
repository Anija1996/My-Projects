export function isLoggedIn() {
    try {
        return Boolean(localStorage.getItem("currentUser"));
    } catch {
        return false;
    }
}

export function requireLogin(navigate, target = "/") {
    if (!isLoggedIn()) {
        navigate("/signin", { state: { from: target } });
        return false;
    }
    return true;
}
