import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Usuarios from "./components/usuarios";
import Contactos from "./components/contactos";

const Rutas = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/contactos" element={<Contactos />} />
        </Routes>
        </BrowserRouter>
    );
};

export default Rutas;