import ProductCard from "./ProductCard";

export default function ProductGrid({products}){
    if(!products.length)
        return 
            <p className="empty-results">No products found.</p>
        return (
        <div className="row g-4">
            {
                products.map(p=>
                    <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                        <ProductCard product={p}/>
                    </div>
                )
            }
        </div>
    )
}
