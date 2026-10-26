import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validateName } from "../utils/formValidation";
import "../styles/auth.css";

const LIMITS = { firstName: 50, lastName: 50, email: 100, password: 64, confirmPassword: 64 };

const getPasswordStrength = (password) => {
    if (!password) return { label: "", className: "" };
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial)
        return { label: "Strong", className: "strong" };
    if (password.length >= 6 && ((hasLower || hasUpper) && hasNumber))
        return { label: "Medium", className: "medium" };
    return { label: "Weak", className: "weak" };
};

export default function CreateAccount() {
    const navigate = useNavigate();
    const [form, setForm] = useState(
        {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            newsletter: false,
            terms: false
        }
    );
    const [touched, setTouched] = useState({});
    const [message, setMessage] = useState("");

    const validateField = (field, value = form[field]) => {
        if (field === "firstName" || field === "lastName") return validateName(value);
        if (field === "email") return validateEmail(value);
        if (field === "password") {
            if (!value) return "Password is required.";
            if (value.length < 8) return "Password must be at least 8 characters.";
            return "";
        }
        if (field === "confirmPassword") {
            if (!value) return "Please confirm your password.";
            if (value !== form.password) return "Passwords do not match.";
        }
        return "";
    };

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setTouched((current) => ({ ...current, [field]: true }));
        setMessage("");
    };

    const submit = (e) => {
        e.preventDefault();
        const fields = ["firstName", "lastName", "email", "password", "confirmPassword"];
        const hasErrors = fields.some((field) => validateField(field));
        setTouched(Object.fromEntries(fields.map((field) => [field, true])));

        if (hasErrors || !form.terms) {
            setMessage(
                !form.terms
                    ? "Please agree to the Terms and Conditions and Privacy Policy."
                    : "Please correct the highlighted fields."
            );
            return;
        }

        let users = [];

        try {
            users = JSON.parse(localStorage.getItem("users") || "[]");
        } catch {
            users = [];
        }

        if (
            users.some(
                (x) =>
                    x.email.toLowerCase() ===
                    form.email.trim().toLowerCase()
            )
        ) {
            setMessage("Email ID already exists.");
            return;
        }

        const user = {
            name: `${form.firstName.trim()} ${form.lastName.trim()}`,
            email: form.email.trim(),
            password: form.password
        };

        localStorage.setItem(
            "users",
            JSON.stringify([...users, user])
        );

        setMessage(
            "Account created successfully. Redirecting to sign in..."
        );

        setTimeout(() => navigate("/signin"), 1000);
    };

    const field = (name, type, placeholder) => (
        <>
            <input
                type={type}
                placeholder={placeholder}
                maxLength={LIMITS[name]}
                required
                value={form[name]}
                onChange={(e) => update(name, e.target.value)}
                className={
                    touched[name] && validateField(name)
                        ? "field-invalid"
                        : ""
                }
            />
            <div className="field-meta">
                <span>
                    {touched[name] && validateField(name)}
                </span>
                <small>
                    {form[name].length}/{LIMITS[name]}
                </small>
            </div>
            {name === "password" && form.password && (
                <div
                    className={`password-strength ${
                        getPasswordStrength(form.password).className
                    }`}
                >
                    <span>
                        Password strength:{" "}
                        {getPasswordStrength(form.password).label}
                    </span>
                </div>
            )}
        </>
    );

    return (
        <main className="auth-screen">
            <div className="login-container border bg-white">
                <div className="auth-heading">
                    <h1>ATELIER</h1>
                    <span>Create your account</span>
                </div>

                <div className="auth-tabs">
                    <div>
                        <Link to="/signin">SIGN IN</Link>
                    </div>
                    <div className="active">
                        <Link to="/create-account">
                            CREATE ACCOUNT
                        </Link>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="create-fields">
                        <div className="name-row">
                            <div>
                                {field(
                                    "firstName",
                                    "text",
                                    "First Name"
                                )}
                            </div>
                            <div>
                                {field(
                                    "lastName",
                                    "text",
                                    "Last Name"
                                )}
                            </div>
                        </div>

                        {field(
                            "email",
                            "email",
                            "Email Address"
                        )}

                        {field(
                            "password",
                            "password",
                            "Password"
                        )}

                        {field(
                            "confirmPassword",
                            "password",
                            "Confirm Password"
                        )}
                    </div>

                    <div className="auth-submit-area create-submit">
                        <label className="check-row">
                            <input
                                type="checkbox"
                                checked={form.newsletter}
                                onChange={(e) =>
                                    update(
                                        "newsletter",
                                        e.target.checked
                                    )
                                }
                            />
                            <span>
                                Subscribe to our newsletter for
                                exclusive offers and updates.
                            </span>
                        </label>

                        <label className="check-row">
                            <input
                                type="checkbox"
                                checked={form.terms}
                                onChange={(e) =>
                                    update(
                                        "terms",
                                        e.target.checked
                                    )
                                }
                            />
                            <span>
                                I agree to the Terms and Conditions
                                and Privacy Policy.
                            </span>
                        </label>

                        <button type="submit">
                            CREATE ACCOUNT
                        </button>

                        {message && (
                            <p className="form-message">
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}