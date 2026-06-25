import {useAuth} from "../context/AuthContext";
import { useState } from "react";

export default function ProfilePage(){
    const{user, updateProfile} = useAuth();

    const[isEditing, setIsEditing] = useState(false);
    
    const[newName, setNewName] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
         await updateProfile(newName);
         setIsEditing(!isEditing);
    }

    return(
        <div className="profile__container">
             <h1 className="profile__greeting">Bentornato {user.name}!</h1>
             <div className="profile__container-info">
                 <h2>Dati personali</h2>
                 <div className="profile__container-info-field">
                    <i className="fa-regular fa-user"></i>
                    <label htmlFor="username">Username:</label>
                    <span id="username">{user.name}</span>
                    {
                       isEditing 
                       ? <form className="modify__form" onSubmit={(e) => handleSubmit(e)}>
                          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}></input>
                          <button type="submit">Salva</button>
                          </form>
                       : <button type="button" className="modify-btn" onClick={() => setIsEditing(!isEditing)}>Modifica</button>
                    }
                    
                 </div>
                 <div className="profile__container-info-field">
                    <i className="fa-regular fa-envelope"></i>
                    <label>Email:</label>
                    <span>{user.email}</span>
                 </div>
            </div>
        </div>
    )
}                                                          