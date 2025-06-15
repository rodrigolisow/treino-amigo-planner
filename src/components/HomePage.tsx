import { useState, useEffect } from 'react';
import { Calendar, Dumbbell, BookOpen, TrendingUp, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

const HomePage = ({ setActiveTab }: HomePageProps) => {
  const { user } = useAuth();
  const [weeklyStats, setWeeklyStats] = useState({ completed: 0, total: 0 });
  const [nextWorkout, setNextWorkout] = useState<{ nome: string; data_agendada: string } | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user) {
      fetchWeeklyStats();
      fetchNextWorkout();
      fetchStreak();
    }
  }, [user]);

  const fetchWeeklyStats = async () => {
    if (!user) return;

    const nextWeekStart = startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 });

    const { data, error } = await supabase
      .from('treinos')
      .select('concluido')
      .eq('user_id', user.id)
      .gte('data_agendada', format(nextWeekStart, 'yyyy-MM-dd'))
      .lte('data_agendada', format(nextWeekEnd, 'yyyy-MM-dd'));

    if (!error && data) {
      const completed = data.filter(t => t.concluido).length;
      setWeeklyStats({ completed, total: data.length });
    }
  };

  const fetchNextWorkout = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('treinos')
      .select('nome, data_agendada')
      .eq('user_id', user.id)
      .eq('concluido', false)
      .gte('data_agendada', format(new Date(), 'yyyy-MM-dd'))
      .order('data_agendada', { ascending: true })
      .limit(1);

    if (!error && data && data.length > 0) {
      setNextWorkout(data[0]);
    }
  };

  const fetchStreak = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('treinos')
      .select('data_conclusao')
      .eq('user_id', user.id)
      .eq('concluido', true)
      .not('data_conclusao', 'is', null)
      .order('data_conclusao', { ascending: false });

    if (!error && data) {
      setStreak(data.length);
    }
  };

  const getNextWorkoutTime = () => {
    if (!nextWorkout) return 'Nenhum agendado';
    
    const workoutDate = new Date(nextWorkout.data_agendada);
    const now = new Date();
    const diffHours = Math.ceil((workoutDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays}d`;
    }
  };
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-fitness-gray-800">
          Bem-vindo ao <span className="bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-600 bg-clip-text text-transparent">Meu Treino</span>
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
                <p className="text-blue-100 text-sm font-medium">Treinos próx. semana</p>
                <p className="text-3xl font-bold">{weeklyStats.completed}/{weeklyStats.total}</p>
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
                <p className="text-3xl font-bold">{getNextWorkoutTime()}</p>
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
                <p className="text-3xl font-bold">{streak}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Workout */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-fitness-gray-800">
            <Dumbbell className="w-6 h-6 text-fitness-blue-600" />
            <span>Próximo Treino</span>
            {nextWorkout && (
              <Badge className="bg-fitness-orange-100 text-fitness-orange-700 hover:bg-fitness-orange-200">
                {format(new Date(nextWorkout.data_agendada), "EEEE, dd/MM", { locale: ptBR })}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
{nextWorkout ? (
            <div className="bg-gradient-to-r from-fitness-blue-50 to-fitness-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-fitness-gray-800 mb-2">{nextWorkout.nome}</h3>
              <p className="text-fitness-gray-600 text-sm">
                Clique em "Ver Treino Completo" para visualizar todos os exercícios
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-fitness-blue-50 to-fitness-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-fitness-gray-800 mb-2">Nenhum treino agendado</h3>
              <p className="text-fitness-gray-600 text-sm">
                Acesse a aba "Treinos" para criar e agendar seus treinos
              </p>
            </div>
          )}
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