import {useAuth} from "../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { myOrders } from "../services/api";

export default function ProfilePage(){
    const{user, updateProfile} = useAuth();
    const[orders, setOrders] = useState([]);
    const[error, setError] = useState("");

    const[isEditingName, setIsEditingName] = useState(false);
    const[isEditingStreet, setIsEditingStreet] = useState(false);
    const[isEditingCity, setIsEditingCity] = useState(false);
    const[isEditingZip, setIsEditingZip] = useState(false);
    
    const[newName, setNewName] = useState(user?.name || "");
    const[newAddress, setNewAddress] = useState(user?.address || {street: "", city: "", zip: ""})
    const[newStreet, setNewStreet] = useState(user?.address?.street || "");
    const[newCity, setNewCity] = useState(user?.address?.city || "");
    const[newZip, setNewZip] = useState(user?.address?.zip || "");

    async function handleSubmitName(e){
        e.preventDefault();
         await updateProfile(newName, newAddress);
         setIsEditingName(!isEditingName);
    }

    async function handleSubmitAddress(e){
      e.preventDefault();
      newAddress.street = newStreet;
      newAddress.city = newCity;
      newAddress.zip = newZip;
      await updateProfile(newName, newAddress)
    }
    
    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await myOrders();
                setOrders(data);
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
                 </div>
            </div>
            <div className="profile__orders">
               <h2>Storico ordini</h2>
                {orders.length === 0 && <p>Nessun ordine effettuato.</p>}
                {orders.map(order => (
                    <div key={order._id} className="profile__order-card">
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
            </div>
         </div>
    );
}                                                          