import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";



export default function HomePage({mockProducts}){
    return (
        <>
             <div className="main__banner"> 
              <h2 className="main__banner-text">Il mercato dei libri universitari</h2>
             </div>
             <div className="products__container">
                {mockProducts.map(product => (
                    <ProductCard product={product} />
                ))}
             </div>
        </>
    )
}