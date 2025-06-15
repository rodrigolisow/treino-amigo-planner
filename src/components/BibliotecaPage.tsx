import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, Heart, Play, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  imagem_url?: string;
}

const BibliotecaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = ['Todos', 'Peito', 'Costas', 'Pernas', 'Glúteo', 'Ombros', 'Braços', 'Core'];

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedCategory]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(ex => ex.categoria === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(ex => 
        ex.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Peito':
        return 'bg-fitness-blue-100 text-fitness-blue-700';
      case 'Costas':
        return 'bg-fitness-orange-100 text-fitness-orange-700';
      case 'Pernas':
        return 'bg-green-100 text-green-700';
      case 'Glúteo':
        return 'bg-purple-100 text-purple-700';
      case 'Ombros':
        return 'bg-yellow-100 text-yellow-700';
      case 'Braços':
        return 'bg-red-100 text-red-700';
      case 'Core':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-fitness-gray-100 text-fitness-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800 mb-2">
            Biblioteca de Exercícios
          </h1>
          <p className="text-fitness-gray-600">Carregando exercícios...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <div className="w-full h-48 bg-fitness-gray-200 animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-fitness-gray-200 animate-pulse rounded" />
                <div className="h-3 bg-fitness-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-6 bg-fitness-gray-200 animate-pulse rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800 mb-2">
          Biblioteca de Exercícios
        </h1>
        <p className="text-fitness-gray-600">
          Explore {exercises.length} exercícios com instruções detalhadas
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fitness-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500' 
                  : ''
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-fitness-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-fitness-gray-800 mb-2">
                  Nenhum exercício encontrado
                </h3>
                <p className="text-fitness-gray-600">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <Card 
              key={exercise.id} 
              className="border-0 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-200"
            >
              <div className="relative">
                {exercise.imagem_url ? (
                  <img 
                    src={exercise.imagem_url} 
                    alt={exercise.nome}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      console.error('Failed to load image:', exercise.imagem_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-fitness-blue-100 to-fitness-orange-100 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-fitness-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className={getCategoryColor(exercise.categoria)}>
                    {exercise.categoria}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-fitness-gray-800 text-lg">{exercise.nome}</h3>
                  <p className="text-sm text-fitness-gray-600 mt-1 line-clamp-2">{exercise.descricao}</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500 hover:from-fitness-blue-700 hover:to-fitness-orange-600">
                  <Play className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(1).map((category) => {
          const count = exercises.filter(ex => ex.categoria === category).length;
          return (
            <Card key={category} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-fitness-gray-800">{count}</p>
                <p className="text-sm text-fitness-gray-600">{category}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BibliotecaPage;