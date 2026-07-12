import {useAuth} from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { myOrders } from "../services/api";

export default function ProfilePage(){
    const{user, updateProfile} = useAuth();
    const[orders, setOrders] = useState([]);
    //stato per registrare gli ordini dell'utente
    const[error, setError] = useState("");

    const[isEditingName, setIsEditingName] = useState(false);
    const[isEditingStreet, setIsEditingStreet] = useState(false);
    const[isEditingCity, setIsEditingCity] = useState(false);
    const[isEditingZip, setIsEditingZip] = useState(false);
    //stati per gestire il rendering del form quando si clicca
    //su Modifica
    
    const[newName, setNewName] = useState(user?.name || "");
    const[newAddress, setNewAddress] = useState(user?.address || {street: "", city: "", zip: ""})
    const[newStreet, setNewStreet] = useState(user?.address?.street || "");
    const[newCity, setNewCity] = useState(user?.address?.city || "");
    const[newZip, setNewZip] = useState(user?.address?.zip || "");
    //stati per registrare i valori immessi nel form

    async function handleSubmitName(e){
        e.preventDefault();
         await updateProfile(newName, newAddress);
         setIsEditingName(!isEditingName);
    }

    async function handleSubmitAddress(e){
      e.preventDefault();
      const updatedAddress = { street: newStreet, city: newCity, zip: newZip }
      setNewAddress(updatedAddress);
      await updateProfile(newName, updatedAddress);
    }

    //alcuni componenti hanno necessità di sincronizzazione con sistemi esterni 
    //(ad esempio con un server per ricevere dati o inviare un log) 
    //quando il componente appare sullo schermo 
    //gli Effect permettono di eseguire codice subito dopo il primo 
    //rendering e dopo il re-rendering relativo ad alcune dipendenze
    //cioè useEffect(callback, dependencies) dice a React di
    //eseguire la callback dopo il render e di rieseguirla solo se uno 
    //dei valori nell'array dependencies è cambiato rispetto all'ultima volta    
    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await myOrders();
                //fa il fetch di tutti gli ordini dell'utente
                setOrders(data);
                //e li salva in orders
            } catch (err) {
                setError(err.message);
            }
        }
        fetchOrders();
    }, []);

    return(
        <div className="profile__container">
             <h1 className="profile__greeting">Bentornato {user.name}!</h1>
             <div className="profile__info">
                 <h2>Dati personali</h2>
                 <div className="profile__info-field">
                    <i className="fa-solid fa-user"></i>
                    <label htmlFor="username">Username:</label>
                    <span id="username">{user.name}</span>
                    {
                       isEditingName
                       ? <form className="modify__form" onSubmit={(e) => handleSubmitName(e)}>
                          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}></input>
                          <button type="submit" className="save-btn">Salva</button>
                          </form>
                       : <button type="button" className="modify-btn" onClick={() => setIsEditingName(!isEditingName)}>Modifica</button>
                    }
                    {/*se isEditingName è true (cioè si clicca su Modifica) appare
                    il form per modificare il nome, altrimenti c'è il bottone Modifica*/}
                    
                 </div>
                 <div className="profile__info-field">
                    <i className="fa-solid fa-envelope"></i>
                    <label>Email:</label>
                    <span>{user.email}</span>
                 </div>
                  <div className="profile__info-field">
                    <i className="fa-solid fa-house"></i>
                    <label htmlFor="street">Via:</label>
                    <span id="street">{user.address?.street || "Nessuna via salvata"}</span>
                    {
                       isEditingStreet
                       ? <form className="modify__form" onSubmit={(e) => {handleSubmitAddress(e); setIsEditingStreet(!isEditingStreet);}}>
                          <input type="text" value={newStreet} onChange={(e) => setNewStreet(e.target.value)}></input>
                          <button type="submit" className="save-btn" >Salva</button>
                          </form>
                       : <button type="button" className="modify-btn" onClick={() => setIsEditingStreet(!isEditingStreet)}>Modifica</button>
                    }
                    {/*se isEditingStreet è true (cioè si clicca su Modifica) appare
                    il form per modificare il nome, altrimenti c'è il bottone Modifica*/}
                 </div>
                 <div className="profile__info-field">
                    <i className="fa-solid fa-city"></i>
                    <label htmlFor="city">Città:</label>
                    <span id="city">{user.address?.city || "Nessuna città salvata"}</span>
                    {
                       isEditingCity
                       ? <form className="modify__form" onSubmit={(e) => {handleSubmitAddress(e); setIsEditingCity(!isEditingCity);}}>
                          <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)}></input>
                          <button type="submit" className="save-btn">Salva</button>
                          </form>
                       : <button type="button" className="modify-btn" onClick={() => setIsEditingCity(!isEditingCity)}>Modifica</button>
                    }
                    {/*se isEditingCity è true (cioè si clicca su Modifica) appare
                    il form per modificare il nome, altrimenti c'è il bottone Modifica*/}
                 </div>
                 <div className="profile__info-field">
                    <i className="fa-solid fa-hashtag"></i>
                    <label htmlFor="zip">CAP:</label>
                    <span id="zip">{user.address?.zip || "Nessun CAP salvato"}</span>
                    {
                       isEditingZip
                       ? <form className="modify__form" onSubmit={(e) => {handleSubmitAddress(e); setIsEditingZip(!isEditingZip);}}>
                          <input type="text" pattern="[0-9]{5}" value={newZip} onChange={(e) => setNewZip(e.target.value)}></input>
                          <button type="submit" className="save-btn" >Salva</button>
                          </form>
                       : <button type="button" className="modify-btn" onClick={() => setIsEditingZip(!isEditingZip)}>Modifica</button>
                    }
                    {/*se isEditingZip è true (cioè si clicca su Modifica) appare
                    il form per modificare il nome, altrimenti c'è il bottone Modifica*/}
                 </div>
            </div>
            <div className="profile__orders">
               <h2>Storico ordini</h2>
                {orders.length === 0 && <p>Nessun ordine effettuato.</p>}
                {/*se orders è vuoto apparirà "Nessun ordine effettuato"*/}
                {orders.map(order => (
                    <div key={order._id} className="profile__order-card">
                     {/*È buona pratica associare ad ogni componente
                    un attributo key univoco
                    Questo aiuta React a fare più velocemente i confronti 
                    tra due alberi quando deve aggiornare la UI*/}
                        <p className="profile__order-date">
                            {new Date(order.createdAt).toLocaleDateString("it-IT")}
                        </p>
                        <p className="profile__order-status">Stato: {order.status}</p>
                        <ul className="profile__order-items">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.title}: {item.price.toFixed(2)} €</li>
                            ))}
                        </ul>
                        <p className="profile__order-total">Totale: {order.total.toFixed(2)} €</p>
                    </div>
                ))}
                {/*quindi per ogni ordine sono visualizzati: 
                   - data della creazione dell'ordine
                   - stato dell'ordine
                   - lista dei libri comprati
                   - totale pagato*/}
            </div>
         </div>
    );
}                                                          