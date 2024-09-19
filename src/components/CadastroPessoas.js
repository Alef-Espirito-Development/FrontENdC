// src/components/CadastroPessoas.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  MenuItem,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Pagination,
  Snackbar,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const CadastroPessoas = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [valorRecebido, setValorRecebido] = useState('');
  const [deOndeVem, setDeOndeVem] = useState('');
  const [tipo, setTipo] = useState('');
  const [quemFezADoacao, setQuemFezADoacao] = useState('');
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletionConfirmationOpen, setDeletionConfirmationOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    setFilteredPeople(
      people.filter(pessoa => 
        pessoa.cpf.includes(searchTerm)
      )
    );
  }, [searchTerm, people]);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://back-end-c-2knx.vercel.app/api/pessoas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPeople(response.data);
      setFilteredPeople(response.data); // Inicializa a lista filtrada
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      setError('Erro ao buscar pessoas.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formatarCpf = (value) => {
    const apenasNumeros = value.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d{2})$/, '$1-$2');
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    handleOpenConfirmationDialog();
  };

  const confirmCadastro = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    handleCloseConfirmationDialog();

    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`https://back-end-c-2knx.vercel.app/api/pessoas/${currentId}`, {
          nome,
          cpf,
          valorRecebido,
          deOndeVem,
          tipo,
          quemFezADoacao,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage('Pessoa atualizada com sucesso!');
      } else {
        await axios.post('https://back-end-c-2knx.vercel.app/api/pessoas', {
          nome,
          cpf,
          valorRecebido,
          deOndeVem,
          tipo,
          quemFezADoacao,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccessMessage('Pessoa cadastrada com sucesso!');
      }
      fetchPeople();
      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error(editMode ? 'Erro ao atualizar pessoa:' : 'Erro ao cadastrar pessoa:', error);
      setError(editMode ? 'Erro ao atualizar pessoa.' : 'Erro ao cadastrar pessoa.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNome('');
    setCpf('');
    setValorRecebido('');
    setDeOndeVem('');
    setTipo('');
    setQuemFezADoacao('');
    setEditMode(false);
    setCurrentId(null);
  };

  const handleEdit = (pessoa) => {
    setNome(pessoa.nome);
    setCpf(pessoa.cpf);
    setValorRecebido(pessoa.valorRecebido);
    setDeOndeVem(pessoa.deOndeVem);
    setTipo(pessoa.tipo);
    setQuemFezADoacao(pessoa.quemFezADoacao);
    setCurrentId(pessoa.id);
    setEditMode(true);
    handleOpenModal();
  };

  const handleDelete = (id) => {
    setCurrentId(id);
    handleOpenDeletionConfirmation();
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://back-end-c-2knx.vercel.app/api/pessoas/${currentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage('Pessoa excluída com sucesso!');
      fetchPeople();
      handleCloseDeletionConfirmation();
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      setError('Erro ao excluir pessoa.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const visiblePeople = filteredPeople.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleOpenConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const handleOpenDeletionConfirmation = () => {
    setDeletionConfirmationOpen(true);
  };

  const handleCloseDeletionConfirmation = () => {
    setDeletionConfirmationOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Pessoas
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenModal} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Adicionar Pessoa'}
      </Button>

      <TextField 
        label="Pesquisar por CPF" 
        variant="outlined" 
        fullWidth 
        margin="normal" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{editMode ? 'Editar Pessoa' : 'Adicionar Pessoa'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCadastro}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Nome" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  fullWidth 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="CPF" 
                  value={cpf} 
                  onChange={(e) => setCpf(formatarCpf(e.target.value))} 
                  fullWidth 
                  required 
                  inputProps={{ maxLength: 14 }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Valor Recebido" 
                  value={valorRecebido} 
                  onChange={(e) => setValorRecebido(e.target.value)} 
                  fullWidth 
                  required 
                  InputProps={{
                    startAdornment: <span>R$ </span>, // Prefixo de moeda
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="De Onde Vem" 
                  value={deOndeVem} 
                  onChange={(e) => setDeOndeVem(e.target.value)} 
                  fullWidth 
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Tipo de doação" 
                  select 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value)} 
                  fullWidth 
                  variant="outlined"
                >
                  <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                  <MenuItem value="Passagem de ônibus">Passagem de ônibus</MenuItem>
                  <MenuItem value="Passagem de avião">Passagem de avião</MenuItem>
                  <MenuItem value="Gasolina">Gasolina</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="Quem Fez a Doação" 
                  value={quemFezADoacao} 
                  onChange={(e) => setQuemFezADoacao(e.target.value)} 
                  fullWidth 
                  required 
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : (editMode ? 'Atualizar' : 'Cadastrar')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação para Cadastro */}
      <Dialog open={confirmationDialogOpen} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirmar Ação</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja {editMode ? 'editar' : 'cadastrar'} esta pessoa?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmCadastro} color="primary" disabled={loading}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Lista de Pessoas
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {visiblePeople.map((pessoa) => (
            <Grid item xs={12} sm={6} md={4} key={pessoa.id}>
              <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', boxShadow: 3, borderRadius: 2 }}>
                <Box sx={{ backgroundColor: '#1976d2', color: '#fff', padding: 1, borderRadius: '2px 2px 0 0' }}>
                  <Typography variant="h6" align="center">{pessoa.nome}</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body2">
                    <strong>Data de cadastro:</strong> {new Date(pessoa.dataCadastro._seconds * 1000).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2"><strong>CPF:</strong> {pessoa.cpf}</Typography>
                  <Typography variant="body2"><strong>Valor Recebido:</strong> {pessoa.valorRecebido}</Typography>
                  <Typography variant="body2"><strong>De Onde Vem:</strong> {pessoa.deOndeVem}</Typography>
                  <Typography variant="body2"><strong>Tipo de doação:</strong> {pessoa.tipo}</Typography>
                  <Typography variant="body2"><strong>Quem Fez a Doação:</strong> {pessoa.quemFezADoacao}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEdit(pessoa)}
                    size="small"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(pessoa.id)}
                    size="small"
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de Confirmação para Exclusão */}
      <Dialog open={deletionConfirmationOpen} onClose={handleCloseDeletionConfirmation}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta pessoa?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletionConfirmation} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={error || successMessage}
      />

      {/* Paginação */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default CadastroPessoas;
