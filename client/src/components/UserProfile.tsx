import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/user/password`, { password }, {
        headers: {
          'x-auth-token': token
        }
      });
      setErrorMessage('');
      setModalMessage('Password changed successfully');
      setShowModal(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Error changing password');
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/user/profile-picture`, formData, {
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
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/user`, {
        headers: {
          'x-auth-token': token
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
