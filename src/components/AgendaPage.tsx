import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Weight, Dumbbell, ArrowLeft, Check, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Workout {
  id: string;
  nome: string;
  data_agendada: string;
  created_at: string;
  concluido: boolean;
  data_conclusao: string | null;
  exercicios_treino: Array<{
    id: string;
    series: number;
    repeticoes: number;
    peso: string;
    com_isometria: boolean;
    exercicios_biblioteca: {
      nome: string;
      categoria: string;
    };
  }>;
}

const AgendaPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('treinos')
        .select(`
          *,
          exercicios_treino (
            *,
            exercicios_biblioteca (
              nome,
              categoria
            )
          )
        `)
        .eq('user_id', user.id)
        .not('data_agendada', 'is', null)
        .order('data_agendada', { ascending: true });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar agenda',
        description: 'Não foi possível carregar seus treinos agendados.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markWorkoutAsComplete = async (workoutId: string) => {
    try {
      const { error } = await supabase
        .from('treinos')
        .update({ 
          concluido: true, 
          data_conclusao: new Date().toISOString() 
        })
        .eq('id', workoutId);

      if (error) throw error;

      // Update local state
      setWorkouts(prev => prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, concluido: true, data_conclusao: new Date().toISOString() }
          : workout
      ));

      // Update selected workout if it's the one being marked
      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout(prev => prev ? {
          ...prev,
          concluido: true,
          data_conclusao: new Date().toISOString()
        } : null);
      }

      toast({
        title: 'Treino concluído!',
        description: 'Parabéns por completar seu treino!',
      });
    } catch (error) {
      toast({
        title: 'Erro ao marcar treino',
        description: 'Não foi possível marcar o treino como concluído.',
        variant: 'destructive',
      });
    }
  };

  const getWorkoutsForDate = (date: string) => {
    return workouts.filter(workout => workout.data_agendada === date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800 mb-2">
            Agenda de Treinos
          </h1>
          <p className="text-fitness-gray-600">Carregando seus treinos...</p>
        </div>
        <div className="w-full h-32 bg-fitness-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  // Workout detail view
  if (selectedWorkout) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedWorkout(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800">{selectedWorkout.nome}</h1>
            <p className="text-fitness-gray-600">
              Agendado para {new Date(selectedWorkout.data_agendada).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Workout details */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl text-fitness-gray-800">Exercícios do Treino</span>
              <Badge className="bg-fitness-blue-100 text-fitness-blue-700">
                {selectedWorkout.exercicios_treino?.length || 0} exercícios
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedWorkout.exercicios_treino?.map((exercise, index) => (
              <div key={index} className="bg-fitness-gray-50 p-4 rounded-lg border-l-4 border-fitness-orange-400">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-fitness-gray-800 text-lg">{exercise.exercicios_biblioteca?.nome}</h3>
                  <Badge variant="secondary" className="bg-fitness-gray-200 text-fitness-gray-700">
                    {exercise.exercicios_biblioteca?.categoria}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-fitness-gray-600" />
                    <span className="text-fitness-gray-600">Séries: <strong>{exercise.series}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4 text-fitness-gray-600" />
                    <span className="text-fitness-gray-600">Repetições: <strong>{exercise.repeticoes}</strong></span>
                  </div>
                  {exercise.peso && (
                    <div className="flex items-center space-x-2">
                      <Weight className="w-4 h-4 text-fitness-gray-600" />
                      <span className="text-fitness-gray-600">Peso: <strong>{exercise.peso}</strong></span>
                    </div>
                  )}
                  {exercise.com_isometria && (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-fitness-orange-100 text-fitness-orange-700 text-xs">
                        Isometria
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              {selectedWorkout.concluido ? (
                <div className="flex items-center justify-center space-x-2 py-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Treino Concluído</span>
                  {selectedWorkout.data_conclusao && (
                    <span className="text-green-600 text-sm">
                      em {new Date(selectedWorkout.data_conclusao).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white"
                  onClick={() => markWorkoutAsComplete(selectedWorkout.id)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar como Concluído
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800">Agenda de Treinos</h1>
          <p className="text-fitness-gray-600">Organize e acompanhe seus treinos</p>
        </div>
        
        {/* View Mode Selector */}
        <div className="flex bg-fitness-gray-100 rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                viewMode === mode
                  ? 'bg-white shadow-sm text-fitness-gray-800'
                  : 'text-fitness-gray-600 hover:text-fitness-gray-800'
              }`}
            >
              {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-fitness-gray-800">
                {viewMode === 'month' 
                  ? currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                  : formatDate(currentDate)
                }
              </h2>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {getWorkoutsForDate(currentDate.toISOString().split('T')[0]).length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-fitness-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-fitness-gray-800 mb-2">
                  Nenhum treino agendado
                </h3>
                <p className="text-fitness-gray-600">
                  Você não tem treinos agendados para este dia
                </p>
              </CardContent>
            </Card>
          ) : (
             getWorkoutsForDate(currentDate.toISOString().split('T')[0]).map((workout) => (
               <Card key={workout.id} className={`border-0 shadow-lg bg-white/70 backdrop-blur-sm ${workout.concluido ? 'ring-2 ring-green-200' : ''}`}>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     <span className="text-xl font-semibold text-fitness-gray-800">{workout.nome}</span>
                     {workout.concluido && (
                       <CheckCircle className="w-5 h-5 text-green-600" />
                     )}
                   </CardTitle>
                   <div className="flex items-center space-x-4 text-sm text-fitness-gray-600">
                     <div className="flex items-center space-x-1">
                       <Clock className="w-4 h-4" />
                       <span>{workout.concluido ? 'Concluído' : 'Agendado'}</span>
                     </div>
                     <div className="flex items-center space-x-1">
                       <Dumbbell className="w-4 h-4" />
                       <span>{workout.exercicios_treino?.length || 0} exercícios</span>
                     </div>
                   </div>
                 </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workout.exercicios_treino?.map((exercise, index) => (
                      <div key={index} className="bg-fitness-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-fitness-gray-800">{exercise.exercicios_biblioteca?.nome}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-fitness-gray-600">
                            {exercise.series}x{exercise.repeticoes}
                            {exercise.peso && ` - ${exercise.peso}`}
                          </span>
                          {exercise.com_isometria && (
                            <Badge className="bg-fitness-orange-100 text-fitness-orange-700 text-xs">
                              Isometria
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {getWeekDays().map((day, index) => {
            const dayStr = day.toISOString().split('T')[0];
            const dayWorkouts = getWorkoutsForDate(dayStr);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <Card 
                key={index}
                className={`border-0 shadow-lg transition-all duration-200 hover:shadow-xl ${
                  isToday 
                    ? 'bg-gradient-to-br from-fitness-blue-50 to-fitness-orange-50 ring-2 ring-fitness-blue-200' 
                    : 'bg-white/70 backdrop-blur-sm'
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-fitness-gray-600">
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
                  </CardTitle>
                  <p className={`text-2xl font-bold ${
                    isToday ? 'text-fitness-blue-600' : 'text-fitness-gray-800'
                  }`}>
                    {day.getDate()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                   {dayWorkouts.map((workout) => (
                     <div 
                       key={workout.id}
                       className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors relative ${
                         workout.concluido 
                           ? 'bg-green-50 border-green-400 hover:bg-green-100' 
                           : 'bg-fitness-orange-50 border-fitness-orange-400 hover:bg-fitness-orange-100'
                       }`}
                       onClick={() => setSelectedWorkout(workout)}
                     >
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-semibold text-fitness-gray-800">{workout.nome}</p>
                           <p className="text-xs text-fitness-gray-600">
                             {workout.exercicios_treino?.length || 0} exercícios
                           </p>
                         </div>
                         {workout.concluido && (
                           <CheckCircle className="w-4 h-4 text-green-600" />
                         )}
                       </div>
                     </div>
                   ))}
                  {dayWorkouts.length === 0 && (
                    <p className="text-xs text-fitness-gray-400 italic">Sem treinos</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-fitness-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {getMonthDays().map((day, index) => {
                const dayStr = day.toISOString().split('T')[0];
                const dayWorkouts = getWorkoutsForDate(dayStr);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`p-2 text-center rounded-lg transition-colors cursor-pointer hover:bg-fitness-gray-50 ${
                      !isCurrentMonth 
                        ? 'text-fitness-gray-300' 
                        : isToday 
                        ? 'bg-fitness-blue-100 text-fitness-blue-600 font-bold'
                        : 'text-fitness-gray-800'
                    }`}
                    onClick={() => {
                      setCurrentDate(day);
                      setViewMode('day');
                    }}
                  >
                     <div className="text-sm">{day.getDate()}</div>
                     {dayWorkouts.length > 0 && isCurrentMonth && (
                       <div className="flex justify-center items-center space-x-1 mt-1">
                         {dayWorkouts.some(w => w.concluido) && (
                           <div className="w-2 h-2 bg-green-500 rounded-full" />
                         )}
                         {dayWorkouts.some(w => !w.concluido) && (
                           <div className="w-2 h-2 bg-fitness-orange-500 rounded-full" />
                         )}
                       </div>
                     )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for no workouts */}
      {workouts.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-fitness-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-fitness-gray-800 mb-2">
              Nenhum treino agendado
            </h3>
            <p className="text-fitness-gray-600 mb-6">
              Crie treinos com datas para vê-los aparecer na sua agenda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgendaPage;