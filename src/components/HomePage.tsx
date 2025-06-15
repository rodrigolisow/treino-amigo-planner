import { Calendar, Dumbbell, BookOpen, TrendingUp, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

const HomePage = ({ setActiveTab }: HomePageProps) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-fitness-gray-800">
          Bem-vindo ao <span className="bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-600 bg-clip-text text-transparent">Meu APP</span>
        </h1>
        <p className="text-xl text-fitness-gray-600 max-w-2xl mx-auto">
          Organize seus treinos de academia de forma inteligente e acompanhe seu progresso
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-fitness-blue-500 to-fitness-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Treinos desta semana</p>
                <p className="text-3xl font-bold">3/4</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-orange-500 to-fitness-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Próximo treino</p>
                <p className="text-3xl font-bold">2h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-fitness-gray-700 to-fitness-gray-800 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Sequência</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workout */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-fitness-gray-800">
            <Dumbbell className="w-6 h-6 text-fitness-blue-600" />
            <span>Treino de Hoje</span>
            <Badge className="bg-fitness-orange-100 text-fitness-orange-700 hover:bg-fitness-orange-200">
              15:30
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-fitness-blue-50 to-fitness-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-fitness-gray-800 mb-2">Peito e Tríceps</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-fitness-gray-600">Supino</p>
                <p className="font-semibold text-fitness-gray-800">4x12</p>
              </div>
              <div>
                <p className="text-fitness-gray-600">Inclinado</p>
                <p className="font-semibold text-fitness-gray-800">3x10</p>
              </div>
              <div>
                <p className="text-fitness-gray-600">Mergulho</p>
                <p className="font-semibold text-fitness-gray-800">3x15</p>
              </div>
              <div>
                <p className="text-fitness-gray-600">Tríceps Testa</p>
                <p className="font-semibold text-fitness-gray-800">4x12</p>
              </div>
            </div>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white font-semibold py-3"
            onClick={() => setActiveTab('agenda')}
          >
            Ver Treino Completo
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 bg-white/70 backdrop-blur-sm"
          onClick={() => setActiveTab('agenda')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-fitness-blue-100 to-fitness-blue-200 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-fitness-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-fitness-gray-800 mb-2">Ver Agenda</h3>
              <p className="text-fitness-gray-600 text-sm">Visualize seus treinos por dia, semana e mês</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 bg-white/70 backdrop-blur-sm"
          onClick={() => setActiveTab('treinos')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-fitness-orange-100 to-fitness-orange-200 rounded-full flex items-center justify-center mx-auto">
              <Dumbbell className="w-8 h-8 text-fitness-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-fitness-gray-800 mb-2">Criar Treino</h3>
              <p className="text-fitness-gray-600 text-sm">Monte novos treinos e organize sua rotina</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 bg-white/70 backdrop-blur-sm"
          onClick={() => setActiveTab('biblioteca')}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-fitness-gray-100 to-fitness-gray-200 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-fitness-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-fitness-gray-800 mb-2">Biblioteca</h3>
              <p className="text-fitness-gray-600 text-sm">Explore exercícios com ilustrações detalhadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;