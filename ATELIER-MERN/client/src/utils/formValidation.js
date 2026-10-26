export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value.trim());

export const validateName = (value) => {
    const name = value.trim();
    if (!name) return "Name is required.";
    if (name.length < 3) return "Name must be at least 3 characters.";
    return "";
};

export const validateEmail = (value) => {
    if (!value.trim()) return "Email is required.";
    if (!isValidEmail(value)) return "Enter a valid email address.";
    return "";
};

export const validateRequired = (value, label) => {
    if (!String(value).trim()) return `${label} is required.`;
    return "";
};
