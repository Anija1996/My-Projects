import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
    return (
        <>
            <footer className="desktop-footer">
                <div className="container-fluid">
                    <div className="row align-items-start">
                        <div className="col-md-6">
                            <Link to="/" className="footer-logo">
                                ATELIER
                            </Link>

                            <p className="footer-copy">
                                © 2024 ATELIER. DEFINING QUIET LUXURY.
                            </p>
                        </div>

                        <div className="col-md-6">
                            <nav className="footer-navigation">
                                <a href="/#sustainability">SUSTAINABILITY</a>
                                <Link to="/delivery">SHIPPING</Link>
                                <Link to="/contact">CONTACT</Link>
                                <a href="/#privacy">PRIVACY</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </footer>

            <footer className="mobile-footer">
                <Link to="/" className="footer-logo">
                    ATELIER
                </Link>

                <p className="footer-copy">
                    © 2024 ATELIER. DEFINING QUIET LUXURY.
                </p>

                <nav className="mobile-footer-navigation">
                    <a href="/#sustainability">SUSTAINABILITY</a>
                    <Link to="/delivery">SHIPPING</Link>
                    <Link to="/contact">CONTACT</Link>
                    <a href="/#privacy">PRIVACY</a>
                </nav>
            </footer>
        </>
    );
}