// src/components/Register.js
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', { 
        email, 
        password, 
        name 
      });
      console.log('Registration successful', response.data);
    } catch (error) {
      setError('Erro ao registrar. Verifique os dados.');
      console.error('Registration failed', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Registrar</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleRegister}>
        <TextField 
          label="Nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          fullWidth 
          required 
        />
        <TextField 
          label="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          fullWidth 
          required 
        />
        <TextField 
          label="Senha" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          fullWidth 
          required 
        />
        <Button type="submit" variant="contained">Registrar</Button>
      </form>
    </div>
  );
};

export default Register;
