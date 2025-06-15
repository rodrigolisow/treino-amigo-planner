import { useState } from 'react';
import { Calendar, Dumbbell, BookOpen, Home, Menu, X, LogOut, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppLayout = ({ children, activeTab, setActiveTab }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigationItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'treinos', label: 'Treinos', icon: Dumbbell },
    { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-blue-50 to-fitness-orange-50 font-inter">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-fitness-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-poppins font-bold bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-600 bg-clip-text text-transparent">
                Meu APP
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 text-white shadow-lg'
                        : 'text-fitness-gray-600 hover:text-fitness-blue-600 hover:bg-fitness-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* User Menu & Mobile Menu */}
            <div className="flex items-center space-x-2">
              {/* User menu - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hidden md:flex">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-fitness-blue-100 text-fitness-blue-600 font-medium">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.display_name || 'Usuário'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-fitness-gray-200">
            <div className="px-4 py-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start space-x-3 py-3 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-fitness-blue-50 to-fitness-orange-50 text-fitness-blue-600 border-l-4 border-fitness-blue-600'
                        : 'text-fitness-gray-600 hover:bg-fitness-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {/* Mobile User Menu */}
              <div className="pt-3 border-t border-fitness-gray-200 mt-3">
                <div className="flex items-center space-x-3 px-3 py-2 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-fitness-blue-100 text-fitness-blue-600 text-xs">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-fitness-gray-800">{user?.user_metadata?.display_name || 'Usuário'}</span>
                    <span className="text-xs text-fitness-gray-500">{user?.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="w-full justify-start space-x-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;