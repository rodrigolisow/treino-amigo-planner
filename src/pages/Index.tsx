import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import HomePage from '@/components/HomePage';
import AgendaPage from '@/components/AgendaPage';
import TreinosPage from '@/components/TreinosPage';
import BibliotecaPage from '@/components/BibliotecaPage';
import ProfilePage from '@/components/ProfilePage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-blue-50 to-fitness-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
      case 'profile':
        return <ProfilePage />;
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