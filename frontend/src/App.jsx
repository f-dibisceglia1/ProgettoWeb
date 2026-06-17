import { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Menu from './components/Menu';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";


export default function App(){
    const [menuOpen, setMenuOpen] = useState(false);
    //variabile di stato passata ad Header che serve per apertura/chiusura menù 
    //in modalità mobile. cambia ogni volta che si clicca sull'icona hamburger
    const [search, setSearch] = useState("");
    //variabile di stato per la barra di ricerca: in react il valore dei form viene mantenuto 
    //all'interno di uno stato => Single Source of Truth. search e setSearch sono passati ad Header
    //dove si trova la barra di ricerca. 

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
                    <HomePage />
                } />
                <Route path="/login" element={
                    <LoginPage />
                } />
                <Route path="/cart" element={
                    <CartPage />
                } />
            </Routes>
        </main>
        <footer className="footer">
            &copy; 2025-26 UniShelf — Fondamenti del Web, Politecnico di Bari
        </footer>
        </>
    )
}