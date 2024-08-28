import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js'; // Importar crypto-js
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Container, Header, Title, Form, Input, Button, ProfilePicture, ErrorMessage, BackButton } from './UserProfile.styles';

const UserProfile: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const secretKey = process.env.REACT_APP_SECRET_KEY; // Asegúrate de tener esta variable en tu archivo .env

      if (!token) {
        console.error('No token found, unable to change password');
        return;
      }

      // Cifrar la contraseña antes de enviarla
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey!).toString();

      await axios.put(`${process.env.REACT_APP_API_ONLINE}/api/user/password`, { password: encryptedPassword }, {
        headers: {
          'x-auth-token': token // Usar el encabezado x-auth-token con el token
        }
      });
      setErrorMessage('');
      setModalMessage('Password changed successfully');
      setShowModal(true);
    } catch (error) {
      console.error('Error changing password:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setErrorMessage('Unauthorized: maybe the token is invalid or expired');
      } else {
        setErrorMessage('Error changing password');
      }
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found, unable to upload profile picture');
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_ONLINE}/api/user/profile-picture`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setModalMessage('Profile picture uploaded successfully');
      setShowModal(true);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setErrorMessage('Error uploading profile picture');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found, unable to delete account');
        return;
      }

      await axios.delete(`${process.env.REACT_APP_API_ONLINE}/api/user`, {
        headers: {
          'x-auth-token': token // Usar el encabezado x-auth-token con el token
        }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrorMessage('Error deleting account');
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <ArrowLeftOutlined style={{ fontSize: '24px', color: '#fff' }} />
        </BackButton>
        <Title>Perfil de Usuario</Title>
      </Header>
      <Form onSubmit={handlePasswordChange}>
        <h3>Cambiar Contraseña</h3>
        <Input
          type="password"
          placeholder="Nueva Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Cambiar Contraseña</Button>
      </Form>
      <Form>
        <h3>Eliminar Cuenta</h3>
        <Button type="button" onClick={handleDeleteAccount}>Eliminar Cuenta</Button>
      </Form>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notificación</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
