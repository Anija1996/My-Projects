import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

import headerDesktop from "../assets/Header.png";
import headerMobile from "../assets/header-mobile.png";
import essentials from "../assets/Essentials.png";
import shirt from "../assets/Shirt.png";
import jeans from "../assets/Jeans.png";
import jeansMobile from "../assets/jeans-mobile.png";
import shirtMobile from "../assets/shirt-mobile.png";
import outerwearMobile from "../assets/outwear-mobile.png";
import trendingPicks from "../assets/Trending Picks Editorial.png";

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let active = true;
        getProducts()
            .then((items) => { if (active) setProducts(items); })
            .catch(() => { if (active) setProducts([]); });
        return () => { active = false; };
    }, []);

    return (
        <main>
            <header className="hero-section">
                <div className="hero-image">
                    <img src={headerDesktop} className="hero-desktop-image" alt="ATELIER collection"/>
                    <img src={headerMobile} className="hero-mobile-image" alt="ATELIER collection"/>
                    <div className="hero-container">
                        <div className="hero-desktop-content">
                            <p className="hero-eyebrow">NEW COLLECTION</p>
                            <h1 className="hero-title">Timeless Style</h1>
                            <Link to="/products" className="hero-button">EXPLORE COLLECTION</Link>
                        </div>
                        <div className="hero-mobile-content">
                            <h1 className="hero-mobile-title">Timeless Style</h1>
                            <p className="hero-mobile-description">Curated pieces for a life well-lived. Embrace the elegance of understatement.</p>
                            <Link to="/products" className="hero-button">EXPLORE COLLECTION</Link>
                        </div>
                    </div>
                </div>
                <div className="hero-text">
                    <p>Complimentary global shipping and returns on all orders over $300.</p>
                </div>
            </header>

            <section className="essential-section" id="categories">
                <div className="desktop-essentials container-fluid">
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <Link to="/products" className="essential-large-card">
                                <img src={essentials} alt="Essentials"/>
                                <span className="essential-large-link">Essentials</span>
                            </Link>
                        </div>
                        <div className="col-lg-4">
                            <div className="essential-small-column">
                                <Link to="/products?category=Shirts" className="essential-small-card">
                                    <img src={shirt} alt="Shirts"/>
                                    <span className="essential-small-link">Shirts</span>
                                </Link>
                                <Link to="/products?category=Jeans" className="essential-small-card">
                                    <img src={jeans} alt="Jeans"/>
                                    <span className="essential-small-link">Jeans</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mobile-essentials">
                    <div className="section-heading">
                        <h2>Essentials</h2>
                        <hr/>
                    </div>
                    {[
                        [jeansMobile, "Jeans", "Jeans"],
                        [shirtMobile, "Shirts", "Shirts"],
                        [outerwearMobile, "Outerwear", "Outerwear"]
                    ].map(([image, title, category]) => (
                        <Link className="mobile-essential-card" to={`/products?category=${category}`} key={title}>
                            <img src={image} alt={title}/>
                            <div className="mobile-essential-overlay">
                                <p>{title}</p>
                                <span>SHOP NOW</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="new-arrivals">
                <div className="arrivals-container">
                    <div className="arrivals-header">
                        <h2>New Arrivals</h2>
                        <Link to="/products">VIEW ALL</Link>
                    </div>

                    <div className="desktop-products row g-4">
                        {products.slice(0, 4).map(p => <div className="col-md-6 col-lg-3" key={p.id}><ProductCard product={p}/></div>)}
                    </div>

                    <div className="mobile-products row g-3">
                        {products.slice(4, 8).map(p => <div className="col-6" key={p.id}><Link to={`/products/${p.id}`} className="mobile-product-card"><img src={p.image} alt={p.name}/><p className="mobile-product-name">{p.name}</p><p className="mobile-product-price">${p.price}</p></Link></div>)}
                    </div>

                    <div className="mobile-view-all">
                        <Link to="/products">VIEW ALL ARRIVALS</Link>
                    </div>
                </div>
            </section>

            <section className="trending-section container-fluid" id="about">
                <div className="row g-0">
                    <div className="col-md-7">
                        <div className="trending-image">
                            <img src={trendingPicks} alt="Trending picks"/>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="trending-content">
                            <p className="trending-eyebrow">CURATED SELECTION</p>
                            <h2>Trending Picks<br/>For The Season</h2>
                            <p className="trending-description">Discover pieces defined by their meticulous craftsmanship and understated elegance. Designed to transcend seasons, our latest curation offers the perfect balance of form, function, and unparalleled quality.</p>
                            <Link to="/products" className="lookbook-button">VIEW THE LOOKBOOK</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}