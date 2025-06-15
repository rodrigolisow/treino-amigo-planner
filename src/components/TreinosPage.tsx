import { useState } from 'react';
import { Plus, Edit3, Trash2, Copy, Calendar, Clock, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TreinosPage = () => {
  const [workoutPlans, setWorkoutPlans] = useState([
    {
      id: 1,
      name: 'Peito e Tríceps',
      category: 'Superior',
      exercises: [
        { name: 'Supino Reto', sets: 4, reps: 12, weight: 80, isometric: false },
        { name: 'Supino Inclinado', sets: 3, reps: 10, weight: 70, isometric: false },
        { name: 'Mergulho', sets: 3, reps: 15, weight: 0, isometric: true },
        { name: 'Tríceps Testa', sets: 4, reps: 12, weight: 30, isometric: false },
      ],
      createdAt: '2024-06-10',
    },
    {
      id: 2,
      name: 'Costas e Bíceps',
      category: 'Superior',
      exercises: [
        { name: 'Puxada Frontal', sets: 4, reps: 12, weight: 65, isometric: false },
        { name: 'Remada Curvada', sets: 4, reps: 10, weight: 60, isometric: false },
        { name: 'Rosca Direta', sets: 3, reps: 12, weight: 25, isometric: false },
        { name: 'Rosca Martelo', sets: 3, reps: 12, weight: 20, isometric: true },
      ],
      createdAt: '2024-06-08',
    },
    {
      id: 3,
      name: 'Pernas - Anterior',
      category: 'Inferior',
      exercises: [
        { name: 'Agachamento', sets: 4, reps: 15, weight: 100, isometric: false },
        { name: 'Leg Press', sets: 4, reps: 20, weight: 200, isometric: false },
        { name: 'Extensora', sets: 3, reps: 15, weight: 45, isometric: true },
        { name: 'Afundo', sets: 3, reps: 12, weight: 40, isometric: false },
      ],
      createdAt: '2024-06-05',
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    category: '',
    exercises: [],
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Superior':
        return 'bg-fitness-blue-100 text-fitness-blue-700';
      case 'Inferior':
        return 'bg-fitness-orange-100 text-fitness-orange-700';
      case 'Posterior':
        return 'bg-fitness-gray-100 text-fitness-gray-700';
      default:
        return 'bg-fitness-gray-100 text-fitness-gray-700';
    }
  };

  const duplicateWorkout = (workout: any) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      name: `${workout.name} (Cópia)`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWorkoutPlans([...workoutPlans, newWorkout]);
  };

  const deleteWorkout = (id: number) => {
    setWorkoutPlans(workoutPlans.filter(workout => workout.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800">Meus Treinos</h1>
          <p className="text-fitness-gray-600">Crie e gerencie seus planos de treino</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Treino</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="workout-name">Nome do Treino</Label>
                <Input
                  id="workout-name"
                  placeholder="Ex: Peito e Tríceps"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="workout-category">Categoria</Label>
                <Select onValueChange={(value) => setNewWorkout({ ...newWorkout, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Superior">Superior</SelectItem>
                    <SelectItem value="Inferior">Inferior</SelectItem>
                    <SelectItem value="Posterior">Posterior</SelectItem>
                    <SelectItem value="Combinado">Combinado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    // Logic to create workout would go here
                    setIsCreateModalOpen(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500"
                >
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-fitness-blue-100 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-fitness-blue-600" />
              </div>
              <div>
                <p className="text-sm text-fitness-gray-600">Total de Treinos</p>
                <p className="text-xl font-bold text-fitness-gray-800">{workoutPlans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-fitness-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-fitness-orange-600" />
              </div>
              <div>
                <p className="text-sm text-fitness-gray-600">Esta Semana</p>
                <p className="text-xl font-bold text-fitness-gray-800">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-fitness-gray-600">Tempo Médio</p>
                <p className="text-xl font-bold text-fitness-gray-800">65min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-fitness-gray-600">Favoritos</p>
                <p className="text-xl font-bold text-fitness-gray-800">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workout Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutPlans.map((workout) => (
          <Card key={workout.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-fitness-gray-800">
                    {workout.name}
                  </CardTitle>
                  <Badge className={getCategoryColor(workout.category)}>
                    {workout.category}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => duplicateWorkout(workout)}
                    className="text-fitness-gray-600 hover:text-fitness-blue-600"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-fitness-gray-600 hover:text-fitness-orange-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteWorkout(workout.id)}
                    className="text-fitness-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-fitness-gray-700">
                  Exercícios ({workout.exercises.length})
                </p>
                <div className="space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-fitness-gray-600">{exercise.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-fitness-gray-500">
                          {exercise.sets}x{exercise.reps}
                        </span>
                        {exercise.isometric && (
                          <Badge className="bg-fitness-orange-100 text-fitness-orange-700 text-xs">
                            ISO
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <p className="text-xs text-fitness-gray-400 italic">
                      +{workout.exercises.length - 3} exercícios
                    </p>
                  )}
                </div>
              </div>
              
              <div className="pt-2 border-t border-fitness-gray-200">
                <div className="flex items-center justify-between text-xs text-fitness-gray-500 mb-3">
                  <span>Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span>~60-70 min</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white">
                  Agendar Treino
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {workoutPlans.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-fitness-gray-400" />
            <h3 className="text-xl font-semibold text-fitness-gray-800 mb-2">
              Nenhum treino criado ainda
            </h3>
            <p className="text-fitness-gray-600 mb-6">
              Crie seu primeiro treino para começar a organizar sua rotina na academia
            </p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Treino
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TreinosPage;