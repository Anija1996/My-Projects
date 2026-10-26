import {useEffect,useState} from "react";
import {Link,NavLink,useLocation,useNavigate} from "react-router-dom";
import {useCart} from "../context/CartContext";
import {requireLogin} from "../utils/auth";
import "../styles/navbar.css";

export default function Navbar(){
    const{cartCount}=useCart();
    const navigate=useNavigate();
    const location=useLocation();
    const[currentUser,setCurrentUser]=useState(null);
    
    useEffect(()=>{
        const load=()=>{const saved=localStorage.getItem("currentUser");
            try{
                setCurrentUser(saved && localStorage.getItem("token") ? JSON.parse(saved) : null)
            } catch{
                localStorage.removeItem("currentUser");
                setCurrentUser(null)
            }
        }
        load();
        window.addEventListener("storage",load);
        window.addEventListener("authchange",load);
        return()=>{
            window.removeEventListener("storage",load);
            window.removeEventListener("authchange",load);
        }
    },[]);
                
    const goToCart=()=>{
        if(!requireLogin(navigate,"/cart"))
            return;
        
        navigate("/cart")
    };
    const goToAbout=()=>{
        if(location.pathname!=="/")
        {
            navigate("/");
            setTimeout(()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"}),100)
        } else {
            document.getElementById("about")?.scrollIntoView({behavior:"smooth"})
        }
    }
    return (
        <nav className="navbar navbar-expand-md bg-white border-bottom atelier-navbar">
            <div className="container-fluid navbar-container px-3 px-sm-4 px-lg-5">
                <button 
                    className="navbar-toggler d-sm-none border-0 shadow-none p-0" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#mobileMenu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="container-left d-none d-sm-flex align-items-center">
                    <NavLink to="/shop" className="nav-link">SHOP</NavLink>
                    <NavLink to="/categories" className="nav-link">CATEGORIES</NavLink>
                    <button 
                        type="button" 
                        className="nav-link about-button" 
                        onClick={goToAbout}
                    >
                        ABOUT
                    </button>
                </div>
                <div className="container-center">
                    <Link to="/" className="navbar-brand">ATELIER</Link>
                </div>
                <div className="container-right d-none d-lg-flex align-items-center justify-content-end">
                    <button 
                        className="btn icon-btn" 
                        aria-label="Search" 
                        onClick={()=>navigate("/search")}
                    >
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button 
                        className="btn icon-btn" 
                        aria-label="Wishlist" 
                        onClick={()=>navigate("/wishlist")}
                    >
                        <span className="material-symbols-outlined">favorite_border</span>
                    </button>
                    <button 
                        className="btn icon-btn position-relative" 
                        aria-label="Shopping bag" 
                        onClick={goToCart}
                    >
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {cartCount>0&&
                            <span className="cart-live-count">
                                {cartCount}
                            </span>
                        }
                    </button>
                    <button 
                        className="nav-link account-link border-0 bg-transparent" 
                        onClick={()=>navigate(currentUser?"/account":"/signin")}
                    >
                        {currentUser?<span className="material-symbols-outlined">person</span>:"LOGIN"}
                    </button>
                </div>
                <button 
                    className="btn icon-btn d-lg-none p-0 position-relative" 
                    aria-label="Shopping bag" 
                    onClick={goToCart}
                >
                    <span className="material-symbols-outlined">shopping_bag</span>
                    {cartCount>0&&<span className="cart-live-count mobile-count">
                        {cartCount}
                    </span>}
                </button>
            </div>
            <div className="collapse d-sm-none" id="mobileMenu">
                <div className="mobile-menu-container">
                    <Link to="/shop" className="mobile-nav-link">SHOP</Link>
                    <Link to="/categories" className="mobile-nav-link">CATEGORIES</Link>
                    <button 
                        type="button" 
                        className="mobile-nav-link about-button" 
                        onClick={goToAbout}
                    >
                        ABOUT
                    </button>
                    <Link to="/wishlist" className="mobile-nav-link">WISHLIST</Link>
                    <Link to={currentUser?"/account":"/signin"} 
                        className="mobile-nav-link"
                    >
                        {currentUser?"ACCOUNT":"LOGIN"}
                    </Link>
                    <button 
                        type="button" 
                        className="mobile-nav-link mobile-cart-link" 
                        onClick={goToCart}
                    >
                        CART{cartCount>0&&` (${cartCount})`}
                    </button>
                </div>
            </div>
        </nav>
    )
}

