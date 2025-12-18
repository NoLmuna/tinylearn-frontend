import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/globals.css';
import App from './App.jsx';
import { AdminProvider } from './contexts/adminContext.jsx';

/**
 * Application Entry Point
 * Renders the app with React Router, React Query and global styles
 */
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminProvider>
          <App />
        </AdminProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
