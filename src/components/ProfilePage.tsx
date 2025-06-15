import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/useMobile';
import { ImpactStyle } from '@capacitor/haptics';
import { 
  LogOut, 
  User, 
  Settings, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Bell,
  Shield,
  Dumbbell
} from 'lucide-react';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { hapticFeedback } = useMobile();

  const handleSignOut = async () => {
    hapticFeedback(ImpactStyle.Medium);
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erro ao sair',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
    }
  };

  const handleButtonClick = (action: string) => {
    hapticFeedback(ImpactStyle.Light);
    toast({
      title: 'Em breve!',
      description: `A funcionalidade ${action} será implementada em breve.`,
    });
  };

  const stats = [
    { label: 'Treinos', value: '12', icon: Dumbbell, color: 'bg-fitness-blue-100 text-fitness-blue-600' },
    { label: 'Dias seguidos', value: '5', icon: Target, color: 'bg-fitness-orange-100 text-fitness-orange-600' },
    { label: 'Este mês', value: '18', icon: Calendar, color: 'bg-green-100 text-green-600' },
    { label: 'Progresso', value: '85%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ];

  const achievements = [
    { title: 'Primeira semana', description: 'Complete 7 dias de treino', earned: true },
    { title: 'Consistente', description: 'Treinou 5 dias seguidos', earned: true },
    { title: 'Dedicado', description: 'Complete 30 treinos', earned: false },
    { title: 'Campeão', description: 'Complete 100 treinos', earned: false },
  ];

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Profile Header */}
      <Card className="border-0 bg-gradient-to-r from-fitness-blue-50 to-fitness-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-fitness-blue-500 text-white text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-fitness-gray-900">
                {user?.user_metadata?.display_name || 'Usuário'}
              </h1>
              <p className="text-fitness-gray-600">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">
                Membro Premium
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-fitness-gray-900">{stat.value}</p>
                <p className="text-sm text-fitness-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-fitness-orange-500" />
            <span>Conquistas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-fitness-gray-50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                achievement.earned ? 'bg-fitness-orange-500' : 'bg-fitness-gray-300'
              }`}>
                <Trophy className={`w-5 h-5 ${
                  achievement.earned ? 'text-white' : 'text-fitness-gray-500'
                }`} />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  achievement.earned ? 'text-fitness-gray-900' : 'text-fitness-gray-500'
                }`}>
                  {achievement.title}
                </p>
                <p className="text-sm text-fitness-gray-600">{achievement.description}</p>
              </div>
              {achievement.earned && (
                <Badge variant="secondary" className="bg-fitness-orange-100 text-fitness-orange-600">
                  ✓
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-fitness-blue-500" />
            <span>Configurações</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => handleButtonClick('Editar Perfil')}
            className="w-full justify-start space-x-3 h-12"
          >
            <User className="w-5 h-5" />
            <span>Editar Perfil</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleButtonClick('Notificações')}
            className="w-full justify-start space-x-3 h-12"
          >
            <Bell className="w-5 h-5" />
            <span>Notificações</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleButtonClick('Privacidade')}
            className="w-full justify-start space-x-3 h-12"
          >
            <Shield className="w-5 h-5" />
            <span>Privacidade e Segurança</span>
          </Button>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full h-12 text-base font-medium"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;