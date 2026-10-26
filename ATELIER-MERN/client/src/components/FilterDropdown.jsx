import { useEffect, useRef, useState } from "react";

export default function FilterDropdown({ label, value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selected = options.find((option) => option.value === value);

    return (
        <div className="filter-dropdown" ref={ref}>
            <button
                type="button"
                className={`filter-dropdown-button${open ? " open" : ""}`}
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
            >
                <span>{label}{selected && selected.value !== "all" ? `: ${selected.label}` : ""}</span>
                <span className="material-symbols-outlined">keyboard_arrow_down</span>
            </button>

            {open && (
                <div className="filter-dropdown-menu">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={option.value === value ? "selected" : ""}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

