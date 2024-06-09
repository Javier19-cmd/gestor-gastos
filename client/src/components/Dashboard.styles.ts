import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
  height: 100%;
  width: 100%;
`;

export const Header = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const TableHeader = styled.thead`
  background-color: #007bff;
  color: #fff;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

export const TableCell = styled.td`
  padding: 10px;
  text-align: left;
`;

export const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 1.5rem;

  &:hover {
    color: #ddd;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 1rem;
`;

export const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

/* Responsive Styles */
export const responsiveStyles = `
  @media (max-width: 768px) {
    .site-layout .site-layout-background {
      padding: 0 10px;
    }

    .ant-layout-sider {
      width: 80px !important;
    }

    .dashboard-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .dashboard-title {
      margin-top: 10px;
    }

    .dashboard-content {
      padding: 10px;
    }

    .dashboard-form, .dashboard-table {
      width: 100%;
      overflow-x: auto;
    }

    .dashboard-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
`;
