import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children, activeRoute = 'dashboard', onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">
      {/* Collapsible Mobile Drawer & Desktop Fixed Sidebar */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area - Responsive Left Margin for Desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Header
          onNavigate={onNavigate}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />
        <main className="w-full pt-20 px-3 sm:px-space-md lg:px-space-lg pb-space-xl bg-surface flex-1 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
