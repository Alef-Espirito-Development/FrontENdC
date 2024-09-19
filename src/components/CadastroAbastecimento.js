// src/components/CadastroAbastecimento.js
import React, { useState, useEffect, useContext } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
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
  MenuItem, 
  CircularProgress, 
  Snackbar 
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CadastroAbastecimento = () => {
  const { user } = useContext(AuthContext);
  
  // State variables
  const [valorRecebido, setValorRecebido] = useState('');
  const [litros, setLitros] = useState('');
  const [km, setKm] = useState('');
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [cpf, setCpf] = useState('');
  const [placa, setPlaca] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');
  const [cor, setCor] = useState('');
  
  const [abastecimentos, setAbastecimentos] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAbastecimento, setCurrentAbastecimento] = useState(null);
  
  // State para pesquisa e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  // Estados para diálogos de confirmação
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmCadastro, setOpenConfirmCadastro] = useState(false);
  
  // Estado de loading e mensagem
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchAbastecimentos();
  }, []);

  const fetchAbastecimentos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('https://back-end-c-2knx.vercel.app/api/abastecimentos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAbastecimentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar abastecimentos', error);
      setSnackbarMessage('Erro ao buscar abastecimentos.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Funções para formatar CPF e Placa
  const formatarCpf = (value) => {
    const apenasNumeros = value.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d{2})$/, '$1-$2');
  };

  const formatarPlaca = (value) => {
    const apenasLetrasNumeros = value.replace(/[^A-Za-z0-9]/g, '');
    return apenasLetrasNumeros.slice(0, 3) + '-' + apenasLetrasNumeros.slice(3, 7);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setOpenConfirmCadastro(true); // Abrir diálogo de confirmação de cadastro
  };

  const confirmCadastro = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const dataAtual = new Date(); // Data automática
      const novoAbastecimento = {
        nomeProprietario,
        cpf,
        placa,
        tipoVeiculo,
        cor,
        valorRecebido,
        litros,
        km,
        dataCadastro: dataAtual
      };

      if (isEditing) {
        await axios.put(`https://back-end-c-2knx.vercel.app/api/abastecimentos/${currentAbastecimento.id}`, 
          novoAbastecimento, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbarMessage('Abastecimento atualizado com sucesso!');
      } else {
        await axios.post('https://back-end-c-2knx.vercel.app/api/abastecimentos', 
          novoAbastecimento, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbarMessage('Abastecimento cadastrado com sucesso!');
      }
      
      fetchAbastecimentos();
      handleClose();
      resetFormFields();
      setOpenConfirmCadastro(false); // Fechar confirmação de cadastro
    } catch (error) {
      console.error('Erro ao cadastrar/atualizar abastecimento', error);
      setSnackbarMessage('Erro ao cadastrar/atualizar abastecimento.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (abastecimento) => {
    setCurrentAbastecimento(abastecimento);
    setNomeProprietario(abastecimento.nomeProprietario);
    setCpf(abastecimento.cpf);
    setPlaca(abastecimento.placa);
    setTipoVeiculo(abastecimento.tipoVeiculo);
    setCor(abastecimento.cor);
    setValorRecebido(abastecimento.valorRecebido);
    setLitros(abastecimento.litros);
    setKm(abastecimento.km);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setCurrentAbastecimento(id);
    setOpenConfirmDelete(true); // Abrir diálogo de confirmação de exclusão
  };

  const confirmDelete = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://back-end-c-2knx.vercel.app/api/abastecimentos/${currentAbastecimento}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Abastecimento excluído com sucesso!');
      fetchAbastecimentos();
      setOpenConfirmDelete(false); // Fechar confirmação de exclusão
    } catch (error) {
      console.error('Erro ao excluir abastecimento', error);
      setSnackbarMessage('Erro ao excluir abastecimento.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => { setOpen(true); };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setCurrentAbastecimento(null);
  };

  // Função para resetar campos do formulário
  const resetFormFields = () => {
    setNomeProprietario('');
    setCpf('');
    setPlaca('');
    setTipoVeiculo('');
    setCor('');
    setValorRecebido('');
    setLitros('');
    setKm('');
    setIsEditing(false);
    setCurrentAbastecimento(null);
  };

  // Lógica para pesquisar e paginar
  const filteredAbastecimentos = abastecimentos.filter(abastecimento =>
    abastecimento.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAbastecimentos.length / itemsPerPage);
  const displayedAbastecimentos = filteredAbastecimentos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Abastecimento
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Adicionar Abastecimento'}
      </Button>

      {/* Barra de Pesquisa */}
      <TextField 
        label="Pesquisar pela placa do veículo" 
        variant="outlined" 
        fullWidth 
        margin="normal" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      {/* Modal para cadastro/edição */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Abastecimento' : 'Cadastro de Abastecimento'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCadastro}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  label="Nome do Proprietário" 
                  value={nomeProprietario} 
                  onChange={(e) => setNomeProprietario(e.target.value)} 
                  fullWidth 
                  required 
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="CPF" 
                  value={cpf} 
                  onChange={(e) => setCpf(formatarCpf(e.target.value))} 
                  fullWidth 
                  required 
                  variant="outlined"
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Placa" 
                  value={placa} 
                  onChange={(e) => setPlaca(formatarPlaca(e.target.value))} 
                  fullWidth 
                  required 
                  variant="outlined"
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Tipo de Veículo" 
                  select 
                  value={tipoVeiculo} 
                  onChange={(e) => setTipoVeiculo(e.target.value)} 
                  fullWidth 
                  required 
                  variant="outlined"
                >
                  <MenuItem value="Carro">Carro</MenuItem>
                  <MenuItem value="Moto">Moto</MenuItem>
                  <MenuItem value="Caminhão">Caminhão</MenuItem>
                  <MenuItem value="Ônibus">Ônibus</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Cor" 
                  select 
                  value={cor} 
                  onChange={(e) => setCor(e.target.value)} 
                  fullWidth 
                  variant="outlined"
                >
                  <MenuItem value="Vermelho">Vermelho</MenuItem>
                  <MenuItem value="Azul">Azul</MenuItem>
                  <MenuItem value="Verde">Verde</MenuItem>
                  <MenuItem value="Preto">Preto</MenuItem>
                  <MenuItem value="Branco">Branco</MenuItem>
                  <MenuItem value="Prata">Prata</MenuItem>
                  <MenuItem value="Amarelo">Amarelo</MenuItem>
                  <MenuItem value="Laranja">Laranja</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Valor Recebido" 
                  value={valorRecebido} 
                  onChange={(e) => setValorRecebido(e.target.value)} 
                  fullWidth 
                  required 
                  variant="outlined"
                  InputProps={{
                    startAdornment: <span>R$ </span>, // Prefixo de moeda
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Litros" 
                  value={litros} 
                  onChange={(e) => setLitros(e.target.value)} 
                  fullWidth 
                  required 
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Km" 
                  value={km} 
                  onChange={(e) => setKm(e.target.value)} 
                  fullWidth 
                  required 
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleCadastro} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isEditing ? 'Salvar' : 'Cadastrar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmação para Cadastro */}
      <Dialog open={openConfirmCadastro} onClose={() => setOpenConfirmCadastro(false)}>
        <DialogTitle>Confirmar Ação</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja {isEditing ? 'editar' : 'cadastrar'} este abastecimento?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmCadastro(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmCadastro} color="primary" disabled={loading}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Abastecimentos Cadastrados
      </Typography>

      {/* Grid de Cards para Abastecimentos */}
      <Grid container spacing={2}>
        {displayedAbastecimentos.map((abastecimento) => (
          <Grid item xs={12} sm={6} md={4} key={abastecimento.id}>
            <Card variant="outlined" sx={{ backgroundColor: '#f5f5f5', boxShadow: 3, borderRadius: 2 }}>
              <Box sx={{ backgroundColor: '#1976d2', color: '#fff', padding: 1, borderRadius: '2px 2px 0 0' }}>
                <Typography variant="h6" align="center">
                  {abastecimento.nomeProprietario}
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="body2"><strong>Data:</strong> {new Date(abastecimento.dataCadastro._seconds * 1000).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>CPF:</strong> {abastecimento.cpf}</Typography>
                <Typography variant="body2"><strong>Placa:</strong> {abastecimento.placa}</Typography>
                <Typography variant="body2"><strong>Tipo de Veículo:</strong> {abastecimento.tipoVeiculo}</Typography>
                <Typography variant="body2"><strong>Cor:</strong> {abastecimento.cor}</Typography>
                <Typography variant="body2"><strong>Km:</strong> {abastecimento.km}</Typography>
                <Typography variant="body2"><strong>Litros:</strong> {abastecimento.litros}</Typography>
                <Typography variant="body2"><strong>Valor:</strong> R$ {abastecimento.valorRecebido}</Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  href={abastecimento.comprovanteAbastecimento.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  size="small"
                >
                  Ver
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => handleEdit(abastecimento)}
                  size="small"
                >
                  Editar
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => handleDelete(abastecimento.id)}
                  size="small"
                >
                  Excluir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de Confirmação para Exclusão */}
      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este abastecimento?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)} 
        message={snackbarMessage}
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

export default CadastroAbastecimento;
