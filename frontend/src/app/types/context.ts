import { Animal, AnimalCreate, AnimalUpdate } from '../services/animals';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AnimalContextType {
  animals: Animal[];
  addAnimal: (animal: AnimalCreate) => Promise<Animal>;
  updateAnimal: (id: string, animal: AnimalUpdate) => Promise<Animal>;
  deleteAnimal: (id: string) => Promise<void>;
  getAnimal: (id: string) => Animal | undefined;
  loading?: boolean;
  error?: string | null;
}

export type { AuthContextType, AnimalContextType };