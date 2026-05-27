import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Set the base URL for all API requests
// If VITE_API_URL is set (e.g., in Vercel), it uses that. Otherwise, it defaults to relative paths.
axios.defaults.baseURL = (import.meta as any).env?.VITE_API_URL || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
