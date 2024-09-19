// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Drawer, List, ListItem, ListItemText, CssBaseline, IconButton, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false); // Estado para controlar a abertura do Drawer

  const handleLogout = () => {
    logout();
    setOpen(false); // Fechar a sidebar após o logout
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <MenuIcon />
      </IconButton>

      <Drawer variant="temporary" open={open} onClose={() => setOpen(false)}>
        <CssBaseline />
        <div style={{ width: 250 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <h2>Menu</h2>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button component={Link} to="/" onClick={() => setOpen(false)}>
              <HomeIcon />
              <ListItemText primary="Home" />
            </ListItem>

            {user ? (
              <>
                <ListItem button component={Link} to="/cadastro-abastecimento" onClick={() => setOpen(false)}>
                  <AddBoxIcon />
                  <ListItemText primary="Cadastro Abastecimento" />
                </ListItem>
                
                <ListItem button component={Link} to="/cadastro-pessoas" onClick={() => setOpen(false)}>
                  <PersonAddIcon />
                  <ListItemText primary="Cadastro Pessoas" />
                </ListItem>
                
                <ListItem button onClick={handleLogout}>
                  <ExitToAppIcon />
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login" onClick={() => setOpen(false)}>
                  <LoginIcon />
                  <ListItemText primary="Login" />
                </ListItem>
                
                <ListItem button component={Link} to="/register" onClick={() => setOpen(false)}>
                  <AccountCircleIcon />
                  <ListItemText primary="Registrar" />
                </ListItem>
              </>
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
