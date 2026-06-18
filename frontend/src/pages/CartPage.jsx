import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {getCart} from "../utils/cart.js";
import ProductCard from "../components/ProductCard.jsx";


export default function CartPage({mockProducts}){
    const cartIds = getCart();
    //array degli id dei prodotti nel carrello

    const [cartProducts, setCartProducts] = useState(() => {
        return mockProducts.filter(product => cartIds.includes(String(product.id)));
    });
    //variabile di stato per registrare quali prodotti sono nel carrello
    //(deve essere possibile eliminare i prodotti dal carrello anche dalla CartPage)
    //a useState è passata una callback che restituisce un array con i prodotti nel carrello

    //funzione per aggiornare lo stato cartProducts quando si clicca il bottone
    const handleCartProducts = (productId) => {
        setCartProducts(prev => 
            prev.filter(product => product.id !== productId)
            //lascia in cartProducts solo i prodotti con id diverso dal prodotto
            //che si vuole rimuovere, quindi si aggiorna lo stato cartProducts
        );
    };

    return (
        <div className="cart__container">
             <div className="cart-products__container">
                 {cartProducts.map(product => (
                 //fa il rendering solo dei prodotti in cartProducts    
                    <ProductCard key={product.id} product={product} isCart={true} onCartChange={() => handleCartProducts(product.id)} />
                    //non c'è bisogno di mettere di nuovo onClick, perché è già definito nel componente
                    //quindi quando si clicca su Rimuovi dal carrello viene eseguita handleCart che fa tre cose:
                    //1. rimuove il prodotto da localStorage
                    //2. aggiorna lo stato inCart del componente ProductCard
                    //3. chiama la funzione onCartChange che gli stiamo passando, che in realtà è handleCartProducts
                    //   che aggiorna lo stato cartProducts e quindi triggera il rerendering 
                ))}            
            </div>
        </div>
    )
}