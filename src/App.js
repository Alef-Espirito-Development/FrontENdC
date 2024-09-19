// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Verifique a importação
import { Container } from '@mui/material';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './components/Login'; // Verifique a importação
import Register from './components/Register'; // Verifique a importação
import CadastroAbastecimento from './components/CadastroAbastecimento'; // Verifique a importação
import CadastroPessoas from './components/CadastroPessoas'; // Verifique a importação
import Home from './pages/Home'; // Verifique a importação

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
};

const Main = () => {
  const { user } = useContext(AuthContext);
  console.log("User:", user);

  return (
    <Container>
      {user ? <Sidebar /> : null}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cadastro-abastecimento" element={user ? <CadastroAbastecimento /> : <Navigate to="/login" />} />
        <Route path="/cadastro-pessoas" element={user ? <CadastroPessoas /> : <Navigate to="/login" />} />
      </Routes>
    </Container>
  );
};

export default App;
