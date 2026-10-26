import { Link } from "react-router-dom";
import "../styles/shop.css";
import essentials from "../assets/Essentials.png";
import shirt from "../assets/Shirt.png";
import jeans from "../assets/Jeans.png";
import outerwear from "../assets/outwear-mobile.png";
import accessories from "../assets/structured leather tote.png";
import dresses from "../assets/silk midi dress.png";
import shoes from "../assets/sculptural mule heals.png";

const categories = [
    ["Essentials", essentials, "Essentials"],
    ["Shirts", shirt, "Shirts"],
    ["Jeans", jeans, "Jeans"],
    ["Outerwear", outerwear, "Outerwear"],
    ["Accessories", accessories, "Accessories"],
    ["Dresses", dresses, "Dresses"],
    ["Shoes", shoes, "Shoes"],
];

export default function Categories() {
    return (
        <main className="shop-page categories-page">
            <section className="shop-header">
                <p>THE ATELIER EDIT</p>
                <h1>Categories</h1>
                <span>Explore the collection by category</span>
            </section>

            <section className="shop-products">
                <div className="row g-4">
                    {categories.map(([name, image, category]) => (
                        <div className="col-12 col-md-6" key={name}>
                            <Link
                                to={`/products?category=${encodeURIComponent(category)}`}
                                className="category-card"
                            >
                                <img src={image} alt={name} />
                                <div className="category-card-content">
                                    <h2>{name}</h2>
                                    <span>SHOP NOW</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

