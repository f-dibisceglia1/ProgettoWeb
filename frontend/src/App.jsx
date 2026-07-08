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

        socket.on("book:update", ({ bookId, available }) => {
        //quando si comprano i libri nel carrello viene chiamata
        //createOrder che setta la disponibilità di ogni libro 
        //a false (book.available = false) ed emette per ogni libro 
        //l'evento book:update (availabilityUpdates.forEach((u) => io.emit('book:update', u)))
            setBooks(prev => {
                if (!available) {
                    // il libro e' stato venduto lo rimuove dal catalogo visibile
                    return prev.filter(book => book._id !== bookId);
                }
            });
        //quando viene emesso l'evento book:update si aggiorna lo 
        //stato books con i libri ancora disponibili
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
                setBooks(data);
            }catch(err){
                setError(err.message);
            }
        }
        fetchBooks();
    }, [q, category])


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
                    <HomePage books={books} category={category} onCategoryChange={setCategory}/>
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
                    <CartPage books={books}/>
                } />



                {/*il path "/profile" porta alla ProfilePage*/}
                <Route path="/profile" element={
                   <ProfilePage /> 
                } />


                <Route path="/dashboard" element={
                    <DashboardPage />
                } />
            </Routes>
        </main>
        <footer className="footer">
            &copy; 2025-26 UniShelf — Fondamenti del Web, Politecnico di Bari
        </footer>
        </>
    )
}