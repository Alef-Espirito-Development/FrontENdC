// src/components/Login.js
import React, { useState, useContext } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Grid, 
    Paper, 
    Snackbar 
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            console.log("Tentando fazer login com:", email, password);
            await login(email, password);
            console.log("Login bem-sucedido!");
            navigate('/'); // Redireciona para a página principal
        } catch (err) {
            console.error("Falha no login:", err.response ? err.response.data.error : err);
            setError('Erro ao fazer login. Verifique suas credenciais.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                {error && <Typography color="error" align="center">{error}</Typography>}
                <form onSubmit={handleLogin}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField 
                                label="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                fullWidth 
                                required 
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Senha" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                fullWidth 
                                required 
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                sx={{ padding: 1.5 }}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={() => setSnackbarOpen(false)} 
                message={error} 
            />
        </Container>
    );
};

export default Login;
