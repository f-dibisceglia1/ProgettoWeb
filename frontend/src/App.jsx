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
import { listBooks } from './services/api';




export default function App(){
    const [menuOpen, setMenuOpen] = useState(false);
    //variabile di stato passata ad Header che serve per apertura/chiusura menù 
    //in modalità mobile. cambia ogni volta che si clicca sull'icona hamburger
    const [q, setQ] = useState("");
    //variabile di stato per la barra di ricerca: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth. search e setSearch sono passati ad Header
    //dove si trova la barra di ricerca.
    const [error, setError] = useState("");
    const[books, setBooks] = useState([]); 
    const [category, setCategory] = useState("");

    function handleMenu(){
        setMenuOpen(!menuOpen);
        //ogni volta che si clicca sull'icona hamburger menuOpen assume valore opposto al valore
        //attuale
    }

    useEffect(() => {
        const socket = io("/", { path: "/socket.io" });

        socket.on("book:update", ({ bookId, available }) => {
            setBooks(prev => {
                if (!available) {
                    // il libro e' stato venduto lo rimuove dal catalogo visibile
                    return prev.filter(book => book._id !== bookId);
                }
            });
    });

        return () => {
            socket.disconnect();
        };
    }, [])



    useEffect(() => {
        async function fetchBooks(){
            setError("");            
            try{
                const trimmedQ = q.trim();
                const data = await listBooks({q: trimmedQ, category: category});
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
        <main className="main">
            {menuOpen && <Menu />}
            <Routes>
                <Route path="/" element={
                    <HomePage books={books} category={category} onCategoryChange={setCategory}/>
                } />
                <Route path="/books/:id" element={
                    <BookDetailPage />
                } />
                <Route path="/login" element={
                    <LoginPage />
                } />
                <Route path="/cart" element={
                    <CartPage books={books}/>
                } />
                <Route path="/profile" element={
                   <ProfilePage /> 
                }></Route>
            </Routes>
        </main>
        <footer className="footer">
            &copy; 2025-26 UniShelf — Fondamenti del Web, Politecnico di Bari
        </footer>
        </>
    )
}