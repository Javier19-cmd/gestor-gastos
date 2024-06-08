import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
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

export const BackButton = styled.div`
  cursor: pointer;
`;

export const Title = styled.h1`
  font-size: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }

  &.delete {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
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
