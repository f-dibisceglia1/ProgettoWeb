import { createContext, useContext, useState, useEffect } from "react";

import { login as apiLogin, register as apiRegister, logout as apiLogout, me as apiMe} from "../services/api";

const AuthContext = createContext(null);
//lo stato loggato/non loggato è condiviso da tutti i componenti 
//dell'applicazione e quindi invece di cercare di portare lo stato
//al genitore comune più vicino che può creare prop drilling si usa il contesto
//il valore di default è null


//AuthProvider è un componente che ingloba i suoi figli con AuthContext.Provider
//gestisce lo stato dell'autenticazione e fornisce funzioni per login, registrazione e logout
export function AuthProvider({ children }){
    const[user, setUser] = useState(null);
    

    //Alcuni componenti hanno necessità di sincronizzazione con sistemi esterni 
    //(ad esempio con un server per ricevere dati o inviare un log) 
    //quando il componente appare sullo schermo 
    //Gli Effect permettono di eseguire codice subito dopo il primo 
    //rendering e dopo il re-rendering relativo ad alcune dipendenze
    useEffect(() => {
    async function checkAuth() {
        try {
            const data = await apiMe(); 
            //chiama GET /api/auth/me
            setUser(data.user);
        } catch {
            setUser(null); 
            //nessuna sessione attiva
        }
    }
    checkAuth();
}, []);

     async function login(email, password) {
         const data = await apiLogin(email, password);
         setUser(data.user); 
     }

     async function register(username, email, password) {

         await apiRegister(username, email, password);

         await login(email, password);
    }

     async function logout() {
         await apiLogout(); 
         // chiama POST /api/auth/logout
         setUser(null);
     }

     return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

//useAuth è un hook custom che permette ai componenti di accedere al contesto
//usa useContext per prendere e restituire il valore di AuthContext 
//(cioè lo stato user e le funzioni di login, register e logout)
export function useAuth() {
    return useContext(AuthContext);
}
