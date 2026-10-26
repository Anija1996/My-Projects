import {useCart} from "../context/CartContext";

export default function CartItem({item}){
    const{updateQuantity,removeFromCart}=useCart();
    return (
        <article className="cart-item">
            <img src={item.image} alt={item.name}/>
            <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Color: {item.color}</p>
                <p>Size: {item.size}</p>
                <p>${item.price}</p>
                <div className="cart-item-actions">
                    <div className="quantity-control">
                        <button
                            onClick={()=>updateQuantity(item.id,item.size,item.color,item.quantity-1)}
                        >
                            -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                            onClick={()=>updateQuantity(item.id,item.size,item.color,item.quantity+1)}
                        >
                            +
                        </button>
                    </div>
                    <button 
                        className="remove-button" 
                        onClick={()=>removeFromCart(item.id,item.size,item.color)}
                    >
                        REMOVE
                    </button>
                </div>
            </div>
        </article>
    )
}
