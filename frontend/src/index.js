import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  // <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>      
        <App />      
      </AuthProvider>
    </ErrorBoundary>
  // </React.StrictMode>
);

