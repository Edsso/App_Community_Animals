import { useState } from 'react';
import { useAnimals } from '../contexts/AnimalContext';
import { AnimalCard } from '../components/AnimalCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter } from 'lucide-react';

export default function AnimalList() {
  const { animals } = useAnimals();
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'dog' | 'cat'>('all');
  const [vaccinatedFilter, setVaccinatedFilter] = useState<'all' | 'yes' | 'no'>('all');

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.caretaker.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies =
      speciesFilter === 'all' || animal.species === speciesFilter;

    const matchesVaccinated =
      vaccinatedFilter === 'all' ||
      (vaccinatedFilter === 'yes' && animal.vaccinated) ||
      (vaccinatedFilter === 'no' && !animal.vaccinated);

    return matchesSearch && matchesSpecies && matchesVaccinated;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Animais Comunitários</h1>
          <p className="text-gray-600">
            {animals.length} {animals.length === 1 ? 'animal registrado' : 'animais registrados'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nome, local ou cuidador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={speciesFilter} onValueChange={(value: any) => setSpeciesFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Espécie" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="all">Todas as espécies</SelectItem>
                <SelectItem value="dog">Cachorros</SelectItem>
                <SelectItem value="cat">Gatos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vaccinatedFilter} onValueChange={(value: any) => setVaccinatedFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Vacinação" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="yes">Vacinados</SelectItem>
                <SelectItem value="no">Não vacinados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || speciesFilter !== 'all' || vaccinatedFilter !== 'all') && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredAnimals.length} {filteredAnimals.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSpeciesFilter('all');
                  setVaccinatedFilter('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {filteredAnimals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum animal encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
