import React from 'react';
import { AppShell, Container } from '@mantine/core';
import Sidebar from './Sidebar.jsx';

const AppLayout = ({ children, activeSection, onNavigate, hasErrors }) => {
  return (
    <div className="app-layout">
      <aside className="app-layout__sidebar">
        <Sidebar 
          activeSection={activeSection}
          onNavigate={onNavigate}
          hasErrors={hasErrors}
        />
      </aside>
      <main className="app-layout__main">
        <Container size="lg" px={0}>
          {children}
        </Container>
      </main>
    </div>
  );
};

export default AppLayout;
