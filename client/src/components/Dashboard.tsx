import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button as AntButton } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, PieChartOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Container, Header, Title, Form, Input, Button, Table, TableRow, TableHeader, TableCell, TableBody } from './Dashboard.styles';
import './Sidebar.css'; // Asegúrate de tener este archivo para los estilos personalizados

const { Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
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
    navigate('/stats'); // Asegúrate de tener una ruta configurada para estadísticas del usuario
  };

  const handleViewProfile = () => {
    navigate('/profile'); // Asegúrate de tener una ruta configurada para el perfil del usuario
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} onClick={handleViewStats}>
            Estadísticas
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} onClick={handleViewProfile}>
            Perfil
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
            Cerrar Sesión
          </Menu.Item>
        </Menu>
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
