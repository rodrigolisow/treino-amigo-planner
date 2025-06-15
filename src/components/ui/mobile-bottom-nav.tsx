import { Home, Calendar, Dumbbell, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/useMobile';
import { ImpactStyle } from '@capacitor/haptics';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileBottomNav = ({ activeTab, setActiveTab }: MobileBottomNavProps) => {
  const { hapticFeedback, isKeyboardOpen } = useMobile();

  const navigationItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'treinos', label: 'Treinos', icon: Dumbbell },
    { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    hapticFeedback(ImpactStyle.Light);
    setActiveTab(tabId);
  };

  if (isKeyboardOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-fitness-gray-200 pb-safe">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center space-y-1 min-h-[60px] px-2 py-1 transition-all duration-200 ${
                isActive
                  ? 'text-fitness-blue-600'
                  : 'text-fitness-gray-500 hover:text-fitness-blue-600'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-fitness-blue-100' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-fitness-blue-600 font-semibold' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-fitness-blue-600 rounded-full animate-scale-in" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;