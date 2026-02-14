export interface Animal {
  id: string;
  name: string;
  photo: string;
  species: 'dog' | 'cat';
  location: string;
  coordinates: { lat: number; lng: number };
  caretaker: string;
  caretakerContact?: string;
  vaccinated: boolean;
  vaccineDetails?: string;
  neutered: boolean;
  description?: string;
  dateAdded: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Rex e Mel',
    photo: 'https://www.pedigree.com.br/cdn-cgi/image/format=auto,q=90/sites/g/files/fnmzdf2401/files/2024-09/conheca-as-racas-de-cachorros-mais-inteligentes-do-mundo_0.jpg',
    species: 'dog',
    location: 'Praça das Figueiras',
    coordinates: { lat: -27.02139, lng: -48.65179 },
    caretaker: 'Maria Fernanda',
    caretakerContact: '(11) 98765-4321',
    vaccinated: true,
    vaccineDetails: 'Antirrábica (Jan/2026), V10 (Dez/2025)',
    neutered: true,
    description: 'Cachorros muito dócil, adora carinho. Costuma ficar perto do posto de gasolina.',
    dateAdded: '2026-01-15',
  },
  {
    id: '2',
    name: 'Laranjinha',
    photo: 'https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?crop=1&resize=1212,909',
    species: 'cat',
    location: 'Rua Daniel Silvério, Próximo ao comércio local',
    coordinates: { lat: -27.03986, lng: -48.65035 },
    caretaker: 'Jhonathann',
    caretakerContact: '(11) 91234-5678',
    vaccinated: false,
    neutered: false,
    description: 'Gata tranquila que vive no comércio local. Os lojistas ajudam com a alimentação.',
    dateAdded: '2025-12-20',
  },
  {
    id: '3',
    name: 'Caramelo',
    photo: 'https://images.unsplash.com/photo-1739256300929-a3b92a9e2e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJheSUyMGRvZyUyMGJyb3dufGVufDF8fHx8MTc3MDg2MjAzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'dog',
    location: 'Parque Ibirapuera - Portão 3',
    coordinates: { lat: -23.5872, lng: -46.6572 },
    caretaker: 'Ana Costa',
    caretakerContact: '(11) 99999-8888',
    vaccinated: false,
    neutered: false,
    description: 'Cachorro jovem e brincalhão. Precisa de castração e vacinação.',
    dateAdded: '2026-02-01',
  },
  {
    id: '4',
    name: 'Mel',
    photo: 'https://images.unsplash.com/photo-1667518158890-0a6cf60de601?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjB0YWJieSUyMGNhdHxlbnwxfHx8fDE3NzA4NjIwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'cat',
    location: 'Avenida Paulista, 1000',
    coordinates: { lat: -23.5613, lng: -46.6563 },
    caretaker: 'Carlos Mendes',
    vaccinated: true,
    vaccineDetails: 'V4 (Jan/2026), Antirrábica (Jan/2026)',
    neutered: true,
    description: 'Gato laranja muito amigável. Recebe alimentação de diversos comerciantes da região.',
    dateAdded: '2025-11-10',
  },
  {
    id: '5',
    name: 'Pantera',
    photo: 'https://images.unsplash.com/photo-1669822308470-09f3f3e8d4a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwZG9nfGVufDF8fHx8MTc3MDg2MjAzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'dog',
    location: 'Vila Madalena - Rua Harmonia',
    coordinates: { lat: -23.5466, lng: -46.6891 },
    caretaker: 'Fernanda Oliveira',
    caretakerContact: '(11) 97777-6666',
    vaccinated: true,
    vaccineDetails: 'V10 (Jan/2026)',
    neutered: true,
    description: 'Cachorro protetor do bairro, muito conhecido pelos moradores.',
    dateAdded: '2025-10-05',
  },
  {
    id: '6',
    name: 'Branquinha',
    photo: 'https://images.unsplash.com/photo-1627618126891-543ef83a3723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGNhdCUyMHN0cmVldHxlbnwxfHx8fDE3NzA4NjIwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'cat',
    location: 'Bairro da Liberdade',
    coordinates: { lat: -23.5596, lng: -46.6344 },
    caretaker: 'Takeshi Yamamoto',
    caretakerContact: '(11) 96666-5555',
    vaccinated: true,
    vaccineDetails: 'V4 (Dez/2025)',
    neutered: false,
    description: 'Gata calma que vive próximo ao mercado. Precisa de castração.',
    dateAdded: '2026-01-28',
  },
];

export const mockUser: User = {
  id: '1',
  name: 'Usuário Demo',
  email: 'usuario@demo.com',
};
