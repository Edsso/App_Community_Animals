import { createContext, useContext, useState, ReactNode } from 'react';
import { Animal, mockAnimals } from '../data/mockData';
import { AnimalContextType } from '../types/context';

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export function AnimalProvider({ children }: { children: ReactNode }) {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);

  const addAnimal = (animal: Omit<Animal, 'id' | 'dateAdded'>) => {
    const newAnimal: Animal = {
      ...animal,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setAnimals((prev) => [newAnimal, ...prev]);
  };

  const updateAnimal = (id: string, updatedData: Partial<Animal>) => {
    setAnimals((prev) =>
      prev.map((animal) =>
        animal.id === id ? { ...animal, ...updatedData } : animal
      )
    );
  };

  const deleteAnimal = (id: string) => {
    setAnimals((prev) => prev.filter((animal) => animal.id !== id));
  };

  const getAnimal = (id: string) => {
    return animals.find((animal) => animal.id === id);
  };

  return (
    <AnimalContext.Provider
      value={{ animals, addAnimal, updateAnimal, deleteAnimal, getAnimal }}
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
