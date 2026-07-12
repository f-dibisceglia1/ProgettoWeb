import { createContext, useContext, useState, useEffect } from "react";

import { login as apiLogin, register as apiRegister, logout as apiLogout, me as apiMe, updateProfile as apiUpdateProfile} from "../services/api";

const AuthContext = createContext(null);
//lo stato loggato/non loggato è condiviso da tutti i componenti 
//dell'applicazione e quindi invece di cercare di portare lo stato
//al genitore comune più vicino e passare lo stato come props
//che può creare prop drilling si usa il contesto
//il valore di default è null


//AuthProvider è un componente che ingloba i suoi figli con AuthContext.Provider
//gestisce lo stato dell'autenticazione e fornisce funzioni per login, registrazione e logout
//children rappresenta tutto ciò che viene passato tra <AuthProvider> e </AuthProvider>
//in index.jsx, cioè l'intera app (<App />), che potrà quindi accedere al contesto
export function AuthProvider({ children }){
    const[user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    

    //alcuni componenti hanno necessità di sincronizzazione con sistemi esterni 
    //(ad esempio con un server per ricevere dati o inviare un log) 
    //quando il componente appare sullo schermo 
    //gli Effect permettono di eseguire codice subito dopo il primo 
    //rendering e dopo il re-rendering relativo ad alcune dipendenze
    //cioè useEffect(callback, dependencies) dice a React di
    //eseguire la callback dopo il render e di rieseguirla solo se uno 
    //dei valori nell'array dependencies è cambiato rispetto all'ultima volta
    //in questo caso l'array delle dependencies è vuoto --> la callback è eseguita
    //una volta sola subito dopo il primo render 
    useEffect(() => {
    async function checkAuth() {
        //serve per capire se l'utente ha già una sessione attiva all'avvio dell'app
        try {
            const data = await apiMe(); 
            //chiama GET /api/v1/auth/me che restituisce
            //l'utente attualmente autenticato
            setUser(data.user);
            //aggiorna lo stato con l'utente restituito dal server
            //ora tutti i componenti conoscono l'utente
        } catch {
            setUser(null); 
            //nessuna sessione attiva
        } finally {
            setLoading(false);
        }
    }
    checkAuth();
}, []);

     async function login(email, password) {
         const data = await apiLogin(email, password);
         setUser(data.user); 
         //dopo il login riuscito il server restituisce l'utente
         //viene aggiornato lo stato così tutta l'app si 
         //aggiorna di conseguenza
     }

     async function register(username, email, password) {

         await apiRegister(username, email, password);
         //crea il nuovo utente sul server, crea il token e
         //lo memorizza in un cookie

         await login(email, password);
         //effettua il login vero e proprio con le stesse credenziali 
         //appena create così setUser viene chiamato e 
         //l'utente risulta autenticato
     }

     async function logout() {
         await apiLogout(); 
         // chiama POST /api/v1/auth/logout
         //il server cancella il cookie di sessione lato server
         setUser(null);
         //resetta lo stato locale
     }
     
     async function updateProfile(name, address) {
        const data = await apiUpdateProfile(name, address);
        setUser(data.user);
        //si aggiorna lo stato con l'utente modificato che il server 
        //restituisce così i componenti che leggono user si 
        //aggiornano automaticamente mostrando le informazioni corrette
     }

     return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
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
