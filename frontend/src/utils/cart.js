const KEY = "unishelf_cart";
//chiave usata per salvare i dati in localStorage
//localStorage salva solo stringhe


//funzione per leggere i prodotti salvati nel carrello
export function getCart(){
    const storedItem = localStorage.getItem(KEY);
    //localStorage salva solo stringhe, quindi 
    //localStorage.getItem(KEY) restituisce una stringa
    return storedItem ? JSON.parse(storedItem) : [];
    //ternario: se storedItem è "true", cioè non è null,
    //esegue JSON.parse che trasforma la stringa in un array.
    //altrimenti se storedItem è null restituisce un array vuoto
}

//funzione che controlla se un prodotto è già nel carrello
export function isInList(productId){
    return getCart().includes(String(productId));
    //chiama getCart per ottenere l'array degli id dei prodotti 
    //(getCart restituisce un array di id per come è stata definita toggleCart)
    //presenti nel carrello e poi usa includes per cercare il
    //prodotto nell'array tramite l'id. l'id viene prima trasformato
    //in stringa. 
}


export function toggleCart(productId){
    const cartList = getCart();
    //prende l'array degli id dei prodotti nel carrello
    const id = String(productId);
    //trasforma productId in una stringa
    const listId = cartList.indexOf(id);
    //indexOf cerca l'id dell'elemento 
    //nell'array e restituisce l'indice se lo trova, 
    //-1 se non lo trova
    if(listId === -1){
        cartList.push(id);
        //se il prodotto non è nel carrello lo aggiunge
        //cioè aggiunge l'id del prodotto, quindi quando si 
        //chiamerà getCart verrà restituito un'array di id
    } else {
        cartList.splice(listId, 1);
        //se il prodotto è nel carrello lo rimuove con il
        //metodo splice(posizione, numero elementi da rimuovere)
    }
    localStorage.setItem(KEY, JSON.stringify(cartList));
    //salva l'array modificato in localStorage sovrascrivendo quello 
    //precedente

    window.dispatchEvent(new Event("unishelf:cart"));
    //crea un evento custom per notificare a tutta l'applicazione che 
    //la lista di prodotti nel carrello è cambiata
    return cartList;
    //restituisce la lista degli id dei prodotti aggiornata, così
    //se si aggiunge/rimuove un prodotto non bisogna chiamare
    //dopo toggleCart anche getCart per avere la lista
}
