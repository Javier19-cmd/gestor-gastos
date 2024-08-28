import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Container, FormContainer, Title, Form, Label, Input, Button } from './Login.styles';
import { FaArrowLeft } from 'react-icons/fa';  // Importa el icono de flecha

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const apiUrl = process.env.REACT_APP_API_ONLINE;
      const secretKey = process.env.REACT_APP_SECRET_KEY;
  
      if (!secretKey) {
        throw new Error("La clave secreta no está definida en las variables de entorno");
      }
  
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
  
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password: encryptedPassword,
      });
  
      localStorage.setItem('token', response.data.token);
      setModalMessage('Login successful!');
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error during login:", error);
      if (axios.isAxiosError(error)) {
        setModalMessage(error.response ? error.response.data.message : error.message);
        setIsModalOpen(true);
      } else {
        setModalMessage('An unexpected error occurred.');
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalMessage === 'Login successful!') {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  return (
    <Container>
      <FormContainer>
        <BootstrapButton 
          variant="link" 
          onClick={handleBack} 
          style={{ position: 'absolute', top: '10px', left: '10px', color: '#000' }}
        >
          <FaArrowLeft size={24} /> {/* Icono de flecha */}
        </BootstrapButton>
        <Title>Login</Title>
        <Form onSubmit={handleLogin}>
          <div>
            <Label>Email:</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <Label>Password:</Label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <Button type="submit">Login</Button>
        </Form>
      </FormContainer>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={closeModal}>
            Close
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
