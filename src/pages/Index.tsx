import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/components/HomePage';
import AgendaPage from '@/components/AgendaPage';
import TreinosPage from '@/components/TreinosPage';
import BibliotecaPage from '@/components/BibliotecaPage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'agenda':
        return <AgendaPage />;
      case 'treinos':
        return <TreinosPage />;
      case 'biblioteca':
        return <BibliotecaPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
};

export default Index;