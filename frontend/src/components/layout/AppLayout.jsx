import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children, activeRoute = 'dashboard', onNavigate }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeRoute={activeRoute} onNavigate={onNavigate} />
      <div className="pl-64 flex flex-col min-h-screen">
        <Header onNavigate={onNavigate} />
        <main className="w-full pt-16 px-space-lg pb-space-xl bg-surface flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
