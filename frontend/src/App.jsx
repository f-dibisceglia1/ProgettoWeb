import { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Menu from './components/Menu';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";


export default function App(){
    const [menuOpen, setMenuOpen] = useState(false);
    
    function handleMenu(){
        setMenuOpen(!menuOpen);
    }

    return (
        <>
        <Header handleMenu={handleMenu}/>
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
            &copy; 2025-26 PoliFlix — Fondamenti del Web, Politecnico di Bari
        </footer>
        </>
    )
}