import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductRegistration from "./pages/ProductRegistration";
import ProductList from "./pages/ProductList";

function App() {
    return (
        <Routes>
            <Route path="/register" element={<ProductRegistration />} />
            <Route path="/products" element={<ProductList />} />
        </Routes>
    );
}

export default App;
