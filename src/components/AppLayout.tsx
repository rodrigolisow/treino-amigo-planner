import { useState } from 'react';
import { Calendar, Dumbbell, BookOpen, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileBottomNav from '@/components/ui/mobile-bottom-nav';
import { useMobile } from '@/hooks/useMobile';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppLayout = ({ children, activeTab, setActiveTab }: AppLayoutProps) => {
  const { isKeyboardOpen } = useMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-blue-50 to-fitness-orange-50 font-inter">
      {/* Mobile-first Header - Simplified */}
      <header className="bg-white/95 backdrop-blur-md border-b border-fitness-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-poppins font-bold bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-600 bg-clip-text text-transparent">
                Meu APP
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper mobile spacing */}
      <main className={`px-4 py-6 ${isKeyboardOpen ? 'pb-4' : 'pb-24'} transition-all duration-300`}>
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default AppLayout;