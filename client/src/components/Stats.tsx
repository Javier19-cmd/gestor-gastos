import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Container, Header, Title, BackButton } from './Stats.styles';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

Chart.register(...registerables);

const Stats: React.FC = () => {
  const [summary, setSummary] = useState({ totalTransactions: 0, totalAmount: 0 });
  const [monthlyStats, setMonthlyStats] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/stats/summary`, {
          headers: {
            'x-auth-token': token
          }
        });
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    const fetchMonthlyStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/stats/monthly`, {
          headers: {
            'x-auth-token': token
          }
        });
        console.log('Monthly Stats:', response.data); // Verificar el formato de las claves
        setMonthlyStats(response.data);
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      }
    };

    fetchSummary();
    fetchMonthlyStats();
  }, []);

  const barData = {
    labels: Object.keys(monthlyStats).map(month => {
      const [year, monthIndex] = month.split('-').map(Number);
      if (!isNaN(year) && !isNaN(monthIndex)) {
        return new Date(year, monthIndex - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
      }
      return 'Invalid Date';
    }),
    datasets: [
      {
        label: 'Número de Transacciones',
        data: Object.values(monthlyStats).map((stats: any) => stats.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Monto Total',
        data: Object.values(monthlyStats).map((stats: any) => stats.total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Total de Transacciones', 'Monto Total'],
    datasets: [
      {
        data: [summary.totalTransactions, summary.totalAmount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/dashboard')}>
          <ArrowLeftOutlined style={{ fontSize: '24px', color: '#fff' }} />
        </BackButton>
        <Title>Estadísticas del Usuario</Title>
      </Header>
      <div>
        <h3>Resumen</h3>
        <Pie data={pieData} />
      </div>
      <div>
        <h3>Estadísticas Mensuales</h3>
        <Bar data={barData} />
      </div>
    </Container>
  );
};

export default Stats;
