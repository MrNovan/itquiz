import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './components/AppRouter.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  </StrictMode>
);
