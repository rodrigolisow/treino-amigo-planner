import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Plus, Trash2, Search, Calendar, Edit, MoreVertical } from 'lucide-react';

interface Exercise {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  imagem_url?: string;
}

interface WorkoutExercise {
  exercicio_id: string;
  exercicio?: Exercise;
  series: number;
  repeticoes: number;
  peso: string;
  com_isometria: boolean;
}

interface Workout {
  id?: string;
  nome: string;
  data_agendada?: string;
  exercicios: WorkoutExercise[];
}

const TreinosPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [myWorkouts, setMyWorkouts] = useState<any[]>([]);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  
  const [workout, setWorkout] = useState<Workout>({
    nome: '',
    data_agendada: '',
    exercicios: []
  });
  const [workoutTime, setWorkoutTime] = useState('');

  const categories = ['Peito', 'Costas', 'Pernas', 'Glúteo', 'Ombros', 'Braços', 'Core'];

  useEffect(() => {
    fetchExercises();
    fetchMyWorkouts();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedCategory]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercicios_biblioteca')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar exercícios',
        description: 'Não foi possível carregar a biblioteca de exercícios.',
        variant: 'destructive',
      });
    }
  };

  const fetchMyWorkouts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('treinos')
        .select(`
          *,
          exercicios_treino (
            *,
            exercicios_biblioteca (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyWorkouts(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar treinos',
        description: 'Não foi possível carregar seus treinos.',
        variant: 'destructive',
      });
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ex => ex.categoria === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(ex => 
        ex.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      exercicio_id: exercise.id,
      exercicio: exercise,
      series: 3,
      repeticoes: 12,
      peso: '',
      com_isometria: false
    };

    setWorkout(prev => ({
      ...prev,
      exercicios: [...prev.exercicios, newExercise]
    }));
  };

  const updateExerciseInWorkout = (index: number, field: keyof WorkoutExercise, value: any) => {
    setWorkout(prev => ({
      ...prev,
      exercicios: prev.exercicios.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const removeExerciseFromWorkout = (index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercicios: prev.exercicios.filter((_, i) => i !== index)
    }));
  };

  const saveWorkout = async () => {
    if (!user || !workout.nome || workout.exercicios.length === 0) {
      toast({
        title: 'Dados incompletos',
        description: 'Preencha o nome do treino e adicione pelo menos um exercício.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreating(true);

      // Combine date and time if both are provided
      let scheduledDateTime = workout.data_agendada;
      if (workout.data_agendada && workoutTime) {
        scheduledDateTime = `${workout.data_agendada}T${workoutTime}:00`;
      }

      // Save workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('treinos')
        .insert({
          user_id: user.id,
          nome: workout.nome,
          data_agendada: scheduledDateTime || null
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Save exercises
      const exercisesToInsert = workout.exercicios.map(ex => ({
        treino_id: workoutData.id,
        exercicio_id: ex.exercicio_id,
        series: ex.series,
        repeticoes: ex.repeticoes,
        peso: ex.peso,
        com_isometria: ex.com_isometria
      }));

      const { error: exercisesError } = await supabase
        .from('exercicios_treino')
        .insert(exercisesToInsert);

      if (exercisesError) throw exercisesError;

      toast({
        title: 'Treino criado!',
        description: 'Seu treino foi salvo com sucesso.',
      });

      // Reset form
      setWorkout({
        nome: '',
        data_agendada: '',
        exercicios: []
      });
      setWorkoutTime('');

      fetchMyWorkouts();
    } catch (error) {
      toast({
        title: 'Erro ao salvar treino',
        description: 'Não foi possível salvar o treino. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      // Delete exercises first (foreign key constraint)
      const { error: exercisesError } = await supabase
        .from('exercicios_treino')
        .delete()
        .eq('treino_id', workoutId);

      if (exercisesError) throw exercisesError;

      // Delete workout
      const { error: workoutError } = await supabase
        .from('treinos')
        .delete()
        .eq('id', workoutId);

      if (workoutError) throw workoutError;

      toast({
        title: 'Treino excluído!',
        description: 'O treino foi removido com sucesso.',
      });

      fetchMyWorkouts();
    } catch (error) {
      toast({
        title: 'Erro ao excluir treino',
        description: 'Não foi possível excluir o treino. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const editWorkout = (workoutToEdit: any) => {
    // Extract date and time if available
    let date = '';
    let time = '';
    
    if (workoutToEdit.data_agendada) {
      if (workoutToEdit.data_agendada.includes('T')) {
        const [datePart, timePart] = workoutToEdit.data_agendada.split('T');
        date = datePart;
        time = timePart.slice(0, 5); // Remove seconds
      } else {
        date = workoutToEdit.data_agendada;
      }
    }

    // Map exercises to the format expected by the form
    const mappedExercises = workoutToEdit.exercicios_treino?.map((ex: any) => ({
      exercicio_id: ex.exercicio_id,
      exercicio: ex.exercicios_biblioteca,
      series: ex.series,
      repeticoes: ex.repeticoes,
      peso: ex.peso || '',
      com_isometria: ex.com_isometria
    })) || [];

    setWorkout({
      id: workoutToEdit.id,
      nome: workoutToEdit.nome,
      data_agendada: date,
      exercicios: mappedExercises
    });
    setWorkoutTime(time);
    setEditingWorkout(workoutToEdit);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800 mb-2">
          Meus Treinos
        </h1>
        <p className="text-fitness-gray-600">
          Crie e organize seus treinos personalizados
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Criar Treino</TabsTrigger>
          <TabsTrigger value="my-workouts">Meus Treinos</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Workout Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="w-5 h-5 text-fitness-blue-600" />
                <span>Detalhes do Treino</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Nome do Treino</Label>
                <Input
                  id="workout-name"
                  placeholder="Ex: Peito e Tríceps"
                  value={workout.nome}
                  onChange={(e) => setWorkout(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workout-date">Data (opcional)</Label>
                  <Input
                    id="workout-date"
                    type="date"
                    value={workout.data_agendada}
                    onChange={(e) => setWorkout(prev => ({ ...prev, data_agendada: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="workout-time">Hora (opcional)</Label>
                  <Input
                    id="workout-time"
                    type="time"
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Exercises */}
          {workout.exercicios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exercícios Selecionados ({workout.exercicios.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workout.exercicios.map((ex, index) => (
                  <div key={index} className="bg-fitness-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-fitness-gray-800">{ex.exercicio?.nome}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExerciseFromWorkout(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Séries</Label>
                        <Input
                          type="number"
                          min="1"
                          value={ex.series}
                          onChange={(e) => updateExerciseInWorkout(index, 'series', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Repetições</Label>
                        <Input
                          type="number"
                          min="1"
                          value={ex.repeticoes}
                          onChange={(e) => updateExerciseInWorkout(index, 'repeticoes', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Peso (opcional)</Label>
                      <Input
                        placeholder="Ex: 10kg, 15kg..."
                        value={ex.peso}
                        onChange={(e) => updateExerciseInWorkout(index, 'peso', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={ex.com_isometria}
                        onCheckedChange={(checked) => updateExerciseInWorkout(index, 'com_isometria', checked)}
                      />
                      <Label>Adicionar Isometria</Label>
                    </div>
                  </div>
                ))}
                
                <Button
                  onClick={saveWorkout}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600"
                >
                  {isCreating ? 'Salvando...' : 'Salvar Treino'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Exercise Library */}
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Exercícios</CardTitle>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar exercícios..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-fitness-gray-50 transition-colors"
                  >
                    {exercise.imagem_url && (
                      <img
                        src={exercise.imagem_url}
                        alt={exercise.nome}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-fitness-gray-800">{exercise.nome}</h4>
                      <p className="text-sm text-fitness-gray-600">{exercise.descricao}</p>
                      <Badge variant="secondary" className="mt-1">
                        {exercise.categoria}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => addExerciseToWorkout(exercise)}
                      size="sm"
                      className="bg-fitness-blue-600 hover:bg-fitness-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-workouts">
          <div className="space-y-4">
            {myWorkouts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Dumbbell className="w-12 h-12 mx-auto text-fitness-gray-400 mb-4" />
                  <p className="text-fitness-gray-600">Você ainda não criou nenhum treino.</p>
                  <p className="text-sm text-fitness-gray-500">Use a aba "Criar Treino" para começar!</p>
                </CardContent>
              </Card>
            ) : (
              myWorkouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{workout.nome}</span>
                        {workout.data_agendada && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(workout.data_agendada).toLocaleDateString('pt-BR')}
                              {workout.data_agendada.includes('T') && 
                                ` às ${new Date(workout.data_agendada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                              }
                            </span>
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => editWorkout(workout)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteWorkout(workout.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {workout.exercicios_treino?.map((ex: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-fitness-gray-50 rounded">
                          <div>
                            <span className="font-medium">{ex.exercicios_biblioteca?.nome}</span>
                            {ex.com_isometria && (
                              <Badge variant="secondary" className="ml-2 text-xs">Isometria</Badge>
                            )}
                          </div>
                          <div className="text-sm text-fitness-gray-600">
                            {ex.series}x{ex.repeticoes} {ex.peso && `- ${ex.peso}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreinosPage;