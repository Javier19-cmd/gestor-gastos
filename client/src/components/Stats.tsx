import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Container, Header, Title, BackButton } from './Stats.styles';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

Chart.register(...registerables);

const Stats: React.FC = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });
  const [monthlyStats, setMonthlyStats] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_ONLINE}/api/stats/summary`, {
          headers: {
            'x-auth-token': token
          }
        });
        const { totalIncome, totalExpense } = response.data;
        setSummary({ totalIncome, totalExpense });
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    const fetchMonthlyStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_ONLINE}/api/stats/monthly`, {
          headers: {
            'x-auth-token': token
          }
        });
        setMonthlyStats(response.data);
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      }
    };

    fetchSummary();
    fetchMonthlyStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount);
  };

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
        label: 'Ingresos',
        data: Object.values(monthlyStats).map((stats: any) => stats.income || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gastos',
        data: Object.values(monthlyStats).map((stats: any) => Math.abs(stats.expense || 0)),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Ahorros',
        data: Object.values(monthlyStats).map((stats: any) => (stats.income || 0) - Math.abs(stats.expense || 0)),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        data: [summary.totalIncome, Math.abs(summary.totalExpense)],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
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
