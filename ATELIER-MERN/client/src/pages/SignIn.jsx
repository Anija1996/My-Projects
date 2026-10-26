import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validateRequired } from "../utils/formValidation";
import "../styles/auth.css";
import google from "../assets/google.png";
import { api, getApiError } from "../services/api";

const LIMITS = { email: 100, password: 64 };

export default function SignIn() {
    const navigate = useNavigate();

    const [form, setForm] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("rememberMe") || "null");
            return { email: saved?.email || "", password: "" };
        } catch {
            return { email: "", password: "" };
        }
    });

    const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem("rememberMe")));
    const [touched, setTouched] = useState({});
    const [message, setMessage] = useState("");

    const validateField = (field, value = form[field]) => {
        if (field === "email") return validateEmail(value);
        return validateRequired(value, "Password");
    };

    const update = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setTouched((current) => ({
            ...current,
            [field]: true,
        }));

        setMessage("");
    };

    const submit = async (e) => {
        e.preventDefault();

        const errors = Object.keys(form).filter((field) => validateField(field));
        setTouched({ email: true, password: true });
        if (errors.length) return;

        try {
            const response = await api.post("/auth/login", {
                email: form.email.trim(),
                password: form.password,
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("currentUser", JSON.stringify(response.data.user));

            if (rememberMe) {
                localStorage.setItem("rememberMe", JSON.stringify({ email: form.email.trim() }));
            } else {
                localStorage.removeItem("rememberMe");
            }

            window.dispatchEvent(new Event("authchange"));
            navigate("/");
        } catch (error) {
            setMessage(getApiError(error, "Email or password is incorrect."));
        }
    };

    return (
        <main className="auth-screen">
            <div className="login-container border bg-white">

                <div className="auth-heading">
                    <h1>ATELIER</h1>
                    <span>Sign in to your account</span>
                </div>

                <div className="auth-tabs">
                    <div className="active">
                        <Link to="/signin">SIGN IN</Link>
                    </div>

                    <div>
                        <Link to="/create-account">
                            CREATE ACCOUNT
                        </Link>
                    </div>
                </div>

                <form onSubmit={submit}>

                    <div className="auth-fields">

                        <label>EMAIL ADDRESS</label>

                        <input
                            type="email"
                            maxLength={LIMITS.email}
                            required
                            value={form.email}
                            onChange={(e) =>
                                update("email", e.target.value)
                            }
                            className={
                                touched.email &&
                                validateField("email")
                                    ? "field-invalid"
                                    : ""
                            }
                        />

                        <div className="field-meta">
                            <span>
                                {touched.email &&
                                    validateField("email")}
                            </span>

                            <small>
                                {form.email.length}/{LIMITS.email}
                            </small>
                        </div>

                        <label>PASSWORD</label>

                        <input
                            type="password"
                            maxLength={LIMITS.password}
                            required
                            value={form.password}
                            onChange={(e) =>
                                update("password", e.target.value)
                            }
                            className={
                                touched.password &&
                                validateField("password")
                                    ? "field-invalid"
                                    : ""
                            }
                        />

                        <div className="field-meta">
                            <span>
                                {touched.password &&
                                    validateField("password")}
                            </span>

                            <small>
                                {form.password.length}/{LIMITS.password}
                            </small>
                        </div>

                    </div>

                    <div className="auth-submit-area">

                        <div className="remember-row">

                            <label>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(
                                            e.target.checked
                                        )
                                    }
                                />

                                {" "}Remember me
                            </label>

                            <a
                                href="#"
                                onClick={(e) =>
                                    e.preventDefault()
                                }
                            >
                                Forgot password?
                            </a>

                        </div>

                        <button type="submit">
                            SIGN IN
                        </button>

                        {message && (
                            <p className="form-message">
                                {message}
                            </p>
                        )}

                    </div>

                </form>

                <div className="social-section">

                    <div className="or-row">
                        <hr />
                        <span>OR CONTINUE WITH</span>
                        <hr />
                    </div>

                    <button
                        type="button"
                        className="google-button"
                    >
                        <img
                            src={google}
                            style={{
                                width: "80px",
                                height: "auto",
                            }}
                        />

                        <span></span>
                    </button>

                </div>

            </div>
        </main>
    );
}