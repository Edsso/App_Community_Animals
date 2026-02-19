import { api } from './api';

export interface LostAnimal {
  id: number;
  name: string;
  photo: string | null;
  species: 'dog' | 'cat';
  last_seen_location: string;
  last_seen_date: string;
  description: string;
  contact_name: string;
  contact_phone: string;
  found: boolean;
  date_reported: string;
}

export interface LostAnimalCreate {
  name: string;
  photo?: string | null;
  species: 'dog' | 'cat';
  last_seen_location: string;
  last_seen_date: string;
  description: string;
  contact_name: string;
  contact_phone: string;
}

export const lostService = {
  // GET /lost - Lista animais perdidos (não encontrados)
  listarPerdidos: async (): Promise<LostAnimal[]> => {
    return api.get('/lost');
  },
  
  // GET /lost/found - Lista animais encontrados
  listarEncontrados: async (): Promise<LostAnimal[]> => {
    return api.get('/lost/found');
  },
  
  // POST /lost - Reporta animal perdido
  reportar: async (dados: LostAnimalCreate): Promise<LostAnimal> => {
    return api.post('/lost', dados);
  },
  
  // PATCH /lost/{id}/found - Marca como encontrado
  marcarEncontrado: async (id: number): Promise<{ message: string }> => {
    return api.patch(`/lost/${id}/found`, {});
  }
};