import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const loginButton = screen.getByText(/login/i);
  expect(loginButton).toBeInTheDocument();
});
