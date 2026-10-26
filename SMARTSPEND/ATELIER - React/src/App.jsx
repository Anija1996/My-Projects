import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import SignIn from "./pages/SignIn";
import CreateAccount from "./pages/CreateAccount";
import Delivery from "./pages/Delivery";
import Confirm from "./pages/Confirm";
import OrderInvoice from "./pages/OrderInvoice";
import NotFound from "./pages/NotFound";

function App(){
 const location=useLocation();
 const isAuthPage=location.pathname==="/signin"||location.pathname==="/create-account";
 return <>
  {!isAuthPage&&<Navbar/>}
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/products" element={<Products/>}/>
    <Route path="/shop" element={<Products/>}/>
    <Route path="/shop-all" element={<Products/>}/>
    <Route path="/categories" element={<Categories/>}/>
    <Route path="/search" element={<Search/>}/>
    <Route path="/products/:id" element={<ProductDetails/>}/>
    <Route path="/cart" element={<Cart/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/account" element={<Profile/>}/>
    <Route path="/my-account" element={<Profile/>}/>
    <Route path="/wishlist" element={<Wishlist/>}/>
    <Route path="/signin" element={<SignIn/>}/>
    <Route path="/create-account" element={<CreateAccount/>}/>
    <Route path="/delivery" element={<Delivery/>}/>
    <Route path="/confirm" element={<Confirm/>}/>
    <Route path="/order/:id" element={<OrderInvoice />} />
    <Route path="*" element={<NotFound/>}/>
  </Routes>
  {!isAuthPage&&<Footer/>}
 </>;
}
export default App;
