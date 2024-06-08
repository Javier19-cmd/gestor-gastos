import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { Container, FormContainer, Title, Form, Label, Input, Button } from './Register.styles';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      // console.log("API Base URL:", apiUrl);
      // if (!apiUrl) {
      //   throw new Error("API base URL is not defined");
      // }

      await axios.post(`${apiUrl}/api/auth/register`, {
        email,
        password,
        confirmPassword,
      });

      setModalMessage('User registered successfully!');
      setIsModalOpen(true);
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

  return (
    <Container>
      <FormContainer>
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
