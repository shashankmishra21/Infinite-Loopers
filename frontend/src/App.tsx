import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/pages/Home';
import { Registration } from './components/pages/Registration';
import { Dashboard } from './components/pages/Dashboard';
import { DigitalTwin } from './components/pages/DigitalTwin';
import { Marketplace } from './components/pages/Marketplace';
import { Certificate } from './components/pages/Certificate';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'registration':
        return <Registration onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'digitaltwin':
        return <DigitalTwin />;
      case 'marketplace':
        return <Marketplace />;
      case 'certificate':
        return <Certificate />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-grow">{renderPage()}</main>
      {/* Footer removed per request */}
    </div>
  );
}
