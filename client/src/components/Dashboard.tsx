import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Container, Header, Title, Form, Input, Button, Table, TableRow, TableHeader, TableCell, TableBody, LogoutButton } from './Dashboard.styles';

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<{ description: string, amount: number, _id: string }[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transactions`, {
          headers: {
            'x-auth-token': token
          }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/transactions`, {
        description,
        amount: parseFloat(amount),
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      setTransactions([...transactions, response.data]);
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/transactions/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });

      setTransactions(transactions.filter(transaction => transaction._id !== id));
      setModalMessage('Transacción eliminada exitosamente');
      setShowModal(true);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <Title>Dashboard de Finanzas</Title>
        <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
      </Header>
      <Form onSubmit={addTransaction}>
        <Input 
          type="text" 
          placeholder="Descripción" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <Input 
          type="number" 
          placeholder="Monto" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
        />
        <Button type="submit">Agregar Transacción</Button>
      </Form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Descripción</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>
                <Button onClick={() => deleteTransaction(transaction._id)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

export default Dashboard;
