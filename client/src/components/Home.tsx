import React from 'react';
import { Container, Title, ButtonContainer, StyledLink, Button } from './Home.styles';

const Home: React.FC = () => {
  return (
    <Container>
      <Title>Bienvenido al gestor de finanzas</Title>
      <ButtonContainer>
        <StyledLink to="/login">
          <Button>Login</Button>
        </StyledLink>
        <StyledLink to="/register">
          <Button>Register</Button>
        </StyledLink>
      </ButtonContainer>
    </Container>
  );
};

export default Home;
