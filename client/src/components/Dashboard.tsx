import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button as AntButton, Select } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, PieChartOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Container, Header, Title, Form, Input, Button, Table, TableRow, TableHeader, TableCell, TableBody } from './Dashboard.styles';
import './Sidebar.css';

const { Sider, Content } = Layout;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [transactions, setTransactions] = useState<{ description: string, amount: number, _id: string, type: string }[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // Tipo de transacción
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_ONLINE}/api/transactions`, {
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
      const response = await axios.post(`${process.env.REACT_APP_API_ONLINE}/api/transactions`, {
        description,
        amount: parseFloat(amount),
        type, // Incluyendo el tipo de transacción
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      setTransactions([...transactions, response.data]);
      setDescription('');
      setAmount('');
      setType('expense'); // Resetear tipo después de agregar la transacción
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_ONLINE}/api/transactions/${id}`, {
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

  const handleViewStats = () => {
    navigate('/stats');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { key: '1', icon: <PieChartOutlined />, label: 'Estadísticas', onClick: handleViewStats },
    { key: '2', icon: <UserOutlined />, label: 'Perfil', onClick: handleViewProfile },
    { key: '3', icon: <LogoutOutlined />, label: 'Cerrar Sesión', onClick: handleLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed} breakpoint="md">
        <div className="logo" />
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <AntButton type="primary" onClick={toggleCollapsed} style={{ marginLeft: 16 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </AntButton>
          <Title>Dashboard de Finanzas</Title>
        </Header>
        <Content style={{ margin: '0 16px' }}>
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
            <Select value={type} onChange={(value) => setType(value)}>
              <Option value="expense">Gasto</Option>
              <Option value="income">Ingreso</Option>
            </Select>
            <Button type="submit">Agregar Transacción</Button>
          </Form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Descripción</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</TableCell>
                  <TableCell>
                    <AntButton onClick={() => deleteTransaction(transaction._id)} type="primary" danger>Eliminar</AntButton>
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
