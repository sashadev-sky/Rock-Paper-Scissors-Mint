import { render, screen } from '@testing-library/react';

import App from '../Components/Pages/Home';

test('renders', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
