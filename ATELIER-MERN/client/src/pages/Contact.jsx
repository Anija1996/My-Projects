import { useState } from "react";
import { validateEmail, validateName, validateRequired } from "../utils/formValidation";
import "../styles/contact.css";

const LIMITS = { name: 50, email: 100, subject: 100, message: 500 };

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validateField = (field, value = form[field]) => {
        if (field === "name") return validateName(value);
        if (field === "email") return validateEmail(value);
        return validateRequired(value, field[0].toUpperCase() + field.slice(1));
    };

    const change = (e) => {
        setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
        setTouched((current) => ({ ...current, [e.target.name]: true }));
        setSubmitted(false);
    };

    const submit = (e) => {
        e.preventDefault();
        const fields = Object.keys(form);
        if (fields.some((field) => validateField(field))) {
            setTouched(Object.fromEntries(fields.map((field) => [field, true])));
            return;
        }
        setSubmitted(true);
    };

    const field = (name) => {
        const error = touched[name] ? validateField(name) : "";
        const common = { name, value: form[name], onChange: change, maxLength: LIMITS[name], className: error ? "field-invalid" : "" };
        return <div className="form-field">
            {
                name === "message" 
                ? 
                <textarea {...common} 
                placeholder="MESSAGE" required /> 
                : 
                <input {...common} 
                    type={name === "email" ? "email" : "text"} 
                    placeholder={name.toUpperCase()} 
                    required 
                />
            }
            <div className="field-meta">
                <span>{error}</span>
                <small>{form[name].length}/{LIMITS[name]}</small>
            </div>
        </div>;
    };

    return <main className="contact-page">
        <section className="contact-header">
            <p>WE'RE HERE TO HELP</p>
            <h1>Contact ATELIER</h1>
        </section>
        <section className="contact-layout">
            <div>
                <h2>Get in touch</h2>
                <p>For questions about orders, products, delivery or anything else, send us a message.</p>
            </div>
            <form onSubmit={submit} className="contact-form">
                {field("name")}
                {field("email")}
                {field("subject")}
                {field("message")}
                <button type="submit">SEND MESSAGE</button>
                {submitted&&
                    <p className="success-message">
                        Thank you. Your message has been received.
                    </p>
                }
            </form>
        </section>
    </main>;
}
