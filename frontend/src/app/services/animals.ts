import { api } from './api';

export interface Animal {
  id: number;
  name: string;
  photo: string | null;
  species: 'dog' | 'cat';
  location: string;
  latitude: number;
  longitude: number;
  caretaker: string;
  caretaker_contact: string | null;
  vaccinated: boolean;
  vaccine_details: string | null;
  neutered: boolean;
  description: string | null;
  date_added: string;
}

export interface AnimalCreate {
  name: string;
  photo?: string | null;
  species: 'dog' | 'cat';
  location: string;
  latitude: number;
  longitude: number;
  caretaker: string;
  caretaker_contact?: string | null;
  vaccinated?: boolean;
  vaccine_details?: string | null;
  neutered?: boolean;
  description?: string | null;
}

export interface AnimalUpdate {
  name?: string;
  photo?: string | null;
  location?: string;
  caretaker?: string;
  caretaker_contact?: string | null;
  vaccinated?: boolean;
  vaccine_details?: string | null;
  neutered?: boolean;
  description?: string | null;
}

export const animalService = {
  // GET /animals
  listar: async (): Promise<Animal[]> => {
    return api.get('/animals');
  },
  
  // GET /animals/:id
  buscar: async (id: number): Promise<Animal> => {
    return api.get(`/animals/${id}`);
  },
  
  // POST /animals
  criar: async (dados: AnimalCreate): Promise<Animal> => {
    return api.post('/animals', dados);
  },
  
  // PUT /animals/:id
  atualizar: async (id: number, dados: AnimalUpdate): Promise<Animal> => {
    return api.put(`/animals/${id}`, dados);
  },
  
  // DELETE /animals/:id
  deletar: async (id: number): Promise<{ message: string }> => {
    return api.delete(`/animals/${id}`);
  }
};