import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './scss/main.scss';

import SettingsPage from './pages/SettingsPage.jsx';

const App = () => {
  return (
    <MantineProvider>
      <Notifications />
      <SettingsPage />
    </MantineProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
