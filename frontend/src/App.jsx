import { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Menu from './components/Menu';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage"


export default function App(){
    const [menuOpen, setMenuOpen] = useState(false);
    //variabile di stato passata ad Header che serve per apertura/chiusura menù 
    //in modalità mobile. cambia ogni volta che si clicca sull'icona hamburger
    const [search, setSearch] = useState("");
    //variabile di stato per la barra di ricerca: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth. search e setSearch sono passati ad Header
    //dove si trova la barra di ricerca. 
    

    //!!array di prova per implementare CartPage in attesa di backend!!
    const mockProducts = [
    { id: 1, name: "Analisi Matematica", price: 15, image: "/books/analisi1.jpg" },
    { id: 2, name: "Fisica Generale", price: 20, image: "/books/fisica.jpg" },
    { id: 3, name: "Chimica Organica", price: 18, image: "/books/chimica.jpg" },
    { id: 4, name: "Economia Aziendale", price: 12, image: "/books/economia.jpg" },
    { id: 5, name: "Reti di Telecomunicazioni", price: 15, image: "/books/reti.jpg" },
    { id: 6, name: "Fondamenti Web", price: 20, image: "/books/web.jpg" },
    { id: 7, name: "Calcolo Numerico", price: 13, image: "/books/calcolo.jpg" },
    { id: 8, name: "Metodi di Ottimizzazione", price: 19, image: "/books/metodi.jpg" },
    { id: 9, name: "Algoritmi e Strutture Dati Java", price: 8, image: "/books/java.jpg" },
    { id: 10, name: "Controllo Digitale", price: 12, image: "/books/controllo.jpg" }
];

    function handleMenu(){
        setMenuOpen(!menuOpen);
        //ogni volta che si clicca sull'icona hamburger menuOpen assume valore opposto al valore
        //attuale
    }

    return (
        <>
        <Header handleMenu={handleMenu} search={search} handleSearch={setSearch}/>
        <main className="main">
            {menuOpen && <Menu />}
            <Routes>
                <Route path="/" element={
                    <HomePage mockProducts={mockProducts}/>
                } />
                <Route path="/login" element={
                    <LoginPage />
                } />
                <Route path="/cart" element={
                    <CartPage mockProducts={mockProducts}/>
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