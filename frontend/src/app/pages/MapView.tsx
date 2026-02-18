import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAnimals } from '../contexts/AnimalContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, Navigation, Search } from 'lucide-react';

export default function MapView() {
  const { animals } = useAnimals();
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnimals = animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selected = selectedAnimal
    ? animals.find((a) => a.id === selectedAnimal)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mapa de Animais</h1>
          <p className="text-gray-600">
            Veja a localização dos animais comunitários
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista lateral */}
          <div className="lg:col-span-1 space-y-4 flex flex-col h-[calc(100vh-230px)]">
            <div className="relative mb-4 flex-shrink0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar no mapa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 flex-1 pr-2 overflow-y-auto">
              {filteredAnimals.map((animal) => (
                <Card
                  key={animal.id}
                  className={`cursor-pointer transition-all ${
                    selectedAnimal === animal.id
                      ? 'ring-2 ring-orange-500'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedAnimal(animal.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <img
                        src={animal.photo}
                        alt={animal.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold truncate">
                            {animal.name}
                          </h3>
                          <Badge
                            variant={
                              animal.species === 'dog' ? 'default' : 'secondary'
                            }
                            className="shrink-0 text-xs"
                          >
                            {animal.species === 'dog' ? '🐶' : '🐱'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{animal.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Área do Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-250px)] min-h-500px">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-linear-to-br from-orange-50 to-blue-50 rounded-lg overflow-hidden">
                  {/* Simulação de mapa com posicionamento dos animais */}
                  <div className="absolute inset-0 p-8">
                    {/* Grid de fundo simulando ruas */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid grid-cols-8 grid-rows-8 h-full gap-4">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-gray-400" />
                        ))}
                      </div>
                    </div>

                    {/* Pontos dos animais */}
                    {filteredAnimals.map((animal, index) => {
                      const position = {
                        top: `${15 + (index * 12) % 70}%`,
                        left: `${20 + (index * 15) % 60}%`,
                      };

                      return (
                        <div
                          key={animal.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={position}
                        >
                          <button
                            onClick={() => setSelectedAnimal(animal.id)}
                            className={`relative group ${
                              selectedAnimal === animal.id ? 'z-20' : 'z-10'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                                selectedAnimal === animal.id
                                  ? 'bg-orange-500 scale-125 ring-4 ring-orange-200'
                                  : animal.species === 'dog'
                                  ? 'bg-blue-500 hover:scale-110'
                                  : 'bg-purple-500 hover:scale-110'
                              }`}
                            >
                              <span className="text-white text-lg">
                                {animal.species === 'dog' ? '🐶' : '🐱'}
                              </span>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                {animal.name}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Informações do animal selecionado */}
                  {selected && (
                    <div className="absolute bottom-4 left-4 right-4 z-30">
                      <Card className="shadow-xl">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={selected.photo}
                              alt={selected.name}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-lg">
                                    {selected.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {selected.location}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    selected.species === 'dog'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  {selected.species === 'dog'
                                    ? '🐶 Cachorro'
                                    : '🐱 Gato'}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/animal/${selected.id}`)
                                  }
                                >
                                  Ver Perfil
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedAnimal(null)}
                                >
                                  Fechar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Legenda */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
                    <p className="text-xs font-semibold mb-2">Legenda</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          🐶
                        </div>
                        <span>Cachorro</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          🐱
                        </div>
                        <span>Gato</span>
                      </div>
                    </div>
                  </div>

                  {/* Compass */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-20">
                    <Navigation className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
