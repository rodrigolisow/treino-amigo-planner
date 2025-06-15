import { useState } from 'react';
import { Search, Filter, Heart, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BibliotecaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const exercises = [
    {
      id: 1,
      name: 'Supino Reto',
      category: 'Peito',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400',
      difficulty: 'Intermediário',
      equipment: 'Barra',
      muscles: ['Peitoral', 'Tríceps', 'Deltoides'],
    },
    {
      id: 2,
      name: 'Agachamento Livre',
      category: 'Pernas',
      image: 'https://images.unsplash.com/photo-1571019613540-996a5317c938?w=400',
      difficulty: 'Avançado',
      equipment: 'Barra',
      muscles: ['Quadríceps', 'Glúteos', 'Core'],
    },
    {
      id: 3,
      name: 'Puxada Frontal',
      category: 'Costas',
      image: 'https://images.unsplash.com/photo-1571019613540-996a5317c938?w=400',
      difficulty: 'Iniciante',
      equipment: 'Polia',
      muscles: ['Latíssimo', 'Bíceps', 'Romboides'],
    },
  ];

  const categories = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-fitness-gray-800">Biblioteca de Exercícios</h1>
        <p className="text-fitness-gray-600">Explore exercícios com ilustrações detalhadas</p>
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
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all duration-200">
            <div className="relative">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 right-3">
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-fitness-blue-600 text-white">
                  {exercise.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-fitness-gray-800">{exercise.name}</h3>
                <p className="text-sm text-fitness-gray-600">{exercise.equipment}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {exercise.muscles.map((muscle, index) => (
                  <Badge key={index} className="bg-fitness-orange-100 text-fitness-orange-700 text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-fitness-blue-600 to-fitness-orange-500">
                <Play className="w-4 h-4 mr-2" />
                Ver Execução
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BibliotecaPage;