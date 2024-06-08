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
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
  flex-grow: 1;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  margin-right: 20px;
  svg {
    fill: #fff;
  }
  &:hover {
    color: #ccc;
    svg {
      fill: #ccc;
    }
  }
`;
