import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';  
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Container, FormContainer, Title, Form, Label, Input, Button } from './Register.styles';
import { FaArrowLeft } from 'react-icons/fa';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage('Passwords do not match!');
      setIsModalOpen(true);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_ONLINE;
      const secretKey = process.env.REACT_APP_SECRET_KEY;

      if (!secretKey) {
        throw new Error("La clave secreta no está definida en las variables de entorno");
      }

      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
      const encryptedConfirmPassword = CryptoJS.AES.encrypt(confirmPassword, secretKey).toString();

      await axios.post(`${apiUrl}/api/auth/register`, {
        email,
        password: encryptedPassword,
        confirmPassword: encryptedConfirmPassword,
      });

      setModalMessage('User registered successfully!');
      setIsModalOpen(true);

      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
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
    if (modalMessage === 'User registered successfully!') {
      navigate('/');
    }
  };

  const handleBack = () => {
    navigate(-1);
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
        <Title>Register</Title>
        <Form onSubmit={handleRegister}>
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
          <div>
            <Label>Confirm Password:</Label>
            <Input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          <Button type="submit">Register</Button>
        </Form>
      </FormContainer>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Status</Modal.Title>
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

export default Register;
