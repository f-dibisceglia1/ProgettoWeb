import { useState } from 'react';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from 'socket.io-client';


import Header from './components/Header';
import Menu from './components/Menu';


import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import BookDetailPage from "./pages/BookDetailPage";
import DashboardPage from "./pages/DashboardPage";


import { listBooks } from './services/api';

import { useAuth } from './context/AuthContext';




export default function App(){
    const [menuOpen, setMenuOpen] = useState(false);
    //variabile di stato passata ad Header che serve per apertura/chiusura menù 
    //in modalità mobile. cambia ogni volta che si clicca sull'icona hamburger
    const [q, setQ] = useState("");
    //variabile di stato per la barra di ricerca: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth. 
    //q e setQ sono passati ad Header dove si trova la barra di ricerca.
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const [books, setBooks] = useState([]); 
    

    function handleMenu(){
        setMenuOpen(!menuOpen);
        //ogni volta che si clicca sull'icona hamburger 
        //menuOpen assume valore opposto al valore attuale
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
        const socket = io("/", { path: "/socket.io" });

        socket.on("book:update", (updatedBook) => {
          setBooks(prev => {
            if (!updatedBook.available) {
            //se non più disponibile lo toglie dal catalogo 
                return prev.filter(book => book._id !== updatedBook._id);
            }
           //se il libro e' ancora disponibile ed è nella lista books attuale     
           //.filter() scorre tutto l'array e restituisce un nuovo array
           //contenente solo gli elementi che soddisfano la condizione 
           //"ha lo stesso id del libro aggiornato"
           //questo array puo' contenere al massimo un solo elemento 
           //(perché gli id sono unici) oppure zero
           const match = prev.filter(book => book._id === updatedBook._id);

            if (match.length > 0) {
              return prev.map(book => book._id === updatedBook._id ? updatedBook : book);
              //per ogni libro se il suo _id combacia con quello aggiornato 
              //lo sostituisce con la nuova versione (updatedBook) 
              //altrimenti lo lascia invariato
            }

           return [updatedBook, ...prev];
            //se il libro non era nella lista attuale (era stato rimosso
            //poi e' tornato disponibile) lo aggiunge in cima 
          });
});

    socket.on("book:created", (newBook) => {
        setBooks(prev => [newBook, ...prev]);
        //aggiunge il libro appena creato in cima alla lista
        //senza rifare la fetch
    });

        return () => {
            socket.disconnect();
        };
    }, [])



    useEffect(() => {
        async function fetchBooks(){
            setError(""); 
            //resetta eventuali errori precedenti prima di ogni nuova richiesta
            //altrimenti un vecchio messaggio d'errore rimarrebbe visibile 
            //anche dopo una fetch andata a buon fine           
            try{
                const trimmedQ = q.trim();
                //rimuove spazi vuoti iniziali/finali digitati per errore 
                //nella barra di ricerca
                const data = await listBooks({q: trimmedQ, category: category});
                //chiama listBooks passando filter = {q: trimmedQ, category: category}
                //listBooks crea una query string con filter e manda una GET al server
                setBooks(data.filter(book => book.available));
            }catch(err){
                setError(err.message);
            }
        }
        fetchBooks();
    }, [q, category]);

    function ProtectedRoute({children}){
        const{user, loading} = useAuth();
        
        if(loading) return <p className="loading">Caricamento...</p>;
        //se sta caricando mostra il messaggio "Caricamento..."
        return user ? children : <Navigate to="/login" />;
        //quando ha finito di caricare se l'utente è loggato 
        //renderizza i componenti passati come children a ProtectedRoute
        //altrimenti porta alla pagina di login
    }

    function AdminRoute({ children }) {
        const { user, loading } = useAuth();

        if (loading) return <p className="empty-state">Caricamento...</p>;
        //se sta caricando mostra il messaggio "Caricamento..."
        if(!user) return <Navigate to="/login" />;
        //quando ha finito di caricare 
        //se l'utente non è loggato lo porta alla pagina di login
        return user.role === "admin" ? children : <Navigate to="/" />;
        //se l'utente è loggato e il suo ruolo è admin 
        //renderizza i componenti passati come children a AdminRoute
        //altrimenti porta alla HomePage
    }

    return (
        <>
        <Header handleMenu={handleMenu} search={q} handleSearch={setQ}/>
        {/*ad Header sono passati come props handleMenu per gestire 
        l'apertura/chiusura del menù in modalità mobile cliccando l'icona hamburger, 
        q e setQ come search e handleSearch per registrare cosa viene scritto nella barra
        di ricerca e usarlo poi per fare la fetch al server e aggiornare il catalogo tramite
        lo useEffect*/}
        <main className="main">
            {menuOpen && <Menu />}
            {/*se si clicca sull'cona hamburger nell'header --> menuOpen = true --> viene renderizzato il componente Menu*/}
            <Routes>

                {/*il path "/" porta alla HomePage*/}
                <Route path="/" element={
                    <HomePage books={books} error={error} category={category} onCategoryChange={setCategory} />
                } />
                {/*alla HomePage sono passati come props i libri da mostrare, 
                category e setCategory come category e onCategoryChange perché 
                nella HomePage c'è la FilterBar che permette all'utente di 
                filtrare i libri per categoria. Quando viene selezionata una categoria
                lo stato category si aggiorna e triggera lo useEffect per 
                aggiornare i libri da mostrare nella HomePage*/}


                {/*il path "/books/:id" porta alla BookDetailPage*/}
                <Route path="/books/:id" element={
                    <BookDetailPage />
                } />
                {/*si arriva alla BookDetailPage cliccando sulle BookCard dei
                libri nella HomePage*/}


                {/*il path "/login" porta alla LoginPage*/}
                <Route path="/login" element={
                    <LoginPage />
                } />
                {/*si arriva alla LoginPage cliccando sul Login che si 
                trova nell'header oppure su quello che si trova nel Menu*/}


                {/*il path "/cart" porta alla CartPage*/}
                <Route path="/cart" element={
                    <CartPage />
                } />



                {/*il path "/profile" porta alla ProfilePage*/}
                <Route path="/profile" element={
                   <ProtectedRoute><ProfilePage /></ProtectedRoute> 
                } />


                <Route path="/dashboard" element={
                    <AdminRoute><DashboardPage /></AdminRoute>
                } />
            </Routes>
        </main>
        <footer className="footer">
            &copy; 2025-26 UniShelf — Fondamenti del Web, Politecnico di Bari
        </footer>
        </>
    )
}