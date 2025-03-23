import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import FaculdadesList from "./components/FaculdadesList"; // Supondo que você tenha esse component
import PrivateRoute from "./components/PrivateRoute"; // Importar o PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Rota inicial - Registro */}
        <Route path="/register" element={<Register />} /> {/* Rota de Login */}
        
        {/* Rota de faculdades protegida */}
        <Route
          path="/faculdades"
          element={
            <PrivateRoute>
              <FaculdadesList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
