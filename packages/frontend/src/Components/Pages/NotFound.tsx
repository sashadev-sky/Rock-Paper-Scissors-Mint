import { Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => (
  <main>
    <h1>404 - Not Found!</h1>
    <Container sx={{ minHeight: '65vh' }}>
      <RouterLink to='/'>Go Home</RouterLink>
    </Container>
  </main>
);

export default NotFound;
