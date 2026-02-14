import { Animal, User } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AnimalContextType {
  animals: Animal[];
  addAnimal: (animal: Omit<Animal, 'id' | 'dateAdded'>) => void;
  updateAnimal: (id: string,  animal: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  getAnimal: (id: string) => Animal | undefined;
}

export type { AuthContextType, AnimalContextType };