import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Weight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AgendaPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  // Mock data para treinos
  const workouts = [
    {
      id: 1,
      date: '2024-06-15',
      time: '15:30',
      type: 'Peito e Tríceps',
      duration: '60 min',
      exercises: ['Supino', 'Inclinado', 'Mergulho', 'Tríceps Testa'],
      completed: false,
    },
    {
      id: 2,
      date: '2024-06-16',
      time: '16:00',
      type: 'Costas e Bíceps',
      duration: '70 min',
      exercises: ['Puxada', 'Remada', 'Rosca Direta', 'Martelo'],
      completed: true,
    },
    {
      id: 3,
      date: '2024-06-17',
      time: '14:00',
      type: 'Pernas - Anterior',
      duration: '80 min',
      exercises: ['Agachamento', 'Leg Press', 'Extensora', 'Afundo'],
      completed: false,
    },
  ];

  const getWorkoutsForDate = (date: string) => {
    return workouts.filter(workout => workout.date === date);
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
                {formatDate(currentDate)}
              </h2>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

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
                      className={`p-3 rounded-lg border-l-4 ${
                        workout.completed
                          ? 'bg-green-50 border-green-400'
                          : 'bg-fitness-orange-50 border-fitness-orange-400'
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <Clock className="w-3 h-3 text-fitness-gray-500" />
                        <span className="text-xs text-fitness-gray-600">{workout.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-fitness-gray-800">{workout.type}</p>
                      <p className="text-xs text-fitness-gray-600">{workout.duration}</p>
                      {workout.completed && (
                        <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
                          Concluído
                        </Badge>
                      )}
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

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {getWorkoutsForDate(currentDate.toISOString().split('T')[0]).map((workout) => (
            <Card key={workout.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-fitness-gray-800">
                      {workout.type}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-fitness-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{workout.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{workout.duration}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={workout.completed ? 'bg-green-100 text-green-700' : 'bg-fitness-orange-100 text-fitness-orange-700'}>
                    {workout.completed ? 'Concluído' : 'Agendado'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="bg-fitness-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-fitness-gray-800">{exercise}</p>
                      <div className="flex items-center space-x-1 mt-1 text-xs text-fitness-gray-600">
                        <Weight className="w-3 h-3" />
                        <span>4x12 - 80kg</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white"
                  >
                    {workout.completed ? 'Ver Detalhes' : 'Iniciar Treino'}
                  </Button>
                  <Button variant="outline" className="px-6">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="text-center text-fitness-gray-600">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-fitness-gray-400" />
              <p>Visualização mensal em desenvolvimento</p>
              <p className="text-sm mt-2">Em breve você poderá ver todos os seus treinos do mês</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgendaPage;