import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { animalService, Animal, AnimalCreate, AnimalUpdate } from '../services/animals';
import { AnimalContextType } from '../types/context';

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export function AnimalProvider({ children }: { children: ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalService.listar();
      setAnimals(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar animais');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addAnimal = async (animal: AnimalCreate) => {
    try {
      const newAnimal = await animalService.criar(animal);
      setAnimals(prev => [newAnimal, ...prev]);
      return newAnimal;
    } catch (err) {
      setError('Erro ao adicionar animal');
      console.error(err);
      throw err;
    }
  };

  const updateAnimal = async (id: string, updatedData: AnimalUpdate) => {
    try {
      const numericId = parseInt(id);
      const updatedAnimal = await animalService.atualizar(numericId, updatedData);
      setAnimals(prev =>
        prev.map(animal => animal.id === numericId ? updatedAnimal : animal)
      );
      return updatedAnimal;
    } catch (err) {
      setError('Erro ao atualizar animal');
      console.error(err);
      throw err;
    }
  };

  const deleteAnimal = async (id: string) => {
    try {
      const numericId = parseInt(id);
      await animalService.deletar(numericId);
      setAnimals(prev => prev.filter(animal => animal.id !== numericId));
    } catch (err) {
      setError('Erro ao deletar animal');
      console.error(err);
      throw err;
    }
  };

  const getAnimal = (id: string) => {
    const numericId = parseInt(id);
    return animals.find(animal => animal.id === numericId);
  };

  return (
    <AnimalContext.Provider
      value={{ 
        animals, 
        addAnimal, 
        updateAnimal, 
        deleteAnimal, 
        getAnimal,
        loading, 
        error 
      }}
    >
      {children}
    </AnimalContext.Provider>
  );
}

export function useAnimals() {
  const context = useContext(AnimalContext);
  if (context === undefined) {
    throw new Error('useAnimals must be used within an AnimalProvider');
  }
  return context;
}