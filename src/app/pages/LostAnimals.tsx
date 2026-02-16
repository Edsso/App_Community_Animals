import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Calendar, Phone, CheckCircle, X, Plus } from 'lucide-react';

interface LostAnimal {
  id: string;
  name: string;
  photo: string;
  species: 'dog' | 'cat';
  lastSeenLocation: string;
  lastSeenDate: string;
  description: string;
  contactName: string;
  contactPhone: string;
  found: boolean;
}

const mockLostAnimals: LostAnimal[] = [
  {
    id: '1',
    name: 'Billy',
    photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3N0JTIwZG9nJTIwc2FkfGVufDF8fHx8MTc3MDg2MjAzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'dog',
    lastSeenLocation: 'Praça da Sé',
    lastSeenDate: '2026-02-14',
    description: 'Cachorro pequeno, cor marrom claro, usa coleira vermelha. Muito dócil e responde pelo nome.',
    contactName: 'Roberto Silva',
    contactPhone: '(11) 98888-7777',
    found: false,
  },
  {
    id: '2',
    name: 'Luna',
    photo: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2F0fGVufDB8fDB8fHww',
    species: 'cat',
    lastSeenLocation: 'Avenida Paulista, próximo ao MASP',
    lastSeenDate: '2026-02-15',
    description: 'Gata cinza com olhos verdes, pelagem curta. Filhote.',
    contactName: 'Juliana Costa',
    contactPhone: '(11) 97777-6666',
    found: false,
  },
  {
    id: '3',
    name: 'Thor',
    photo: 'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWclMjBkb2clMjBsb3N0fGVufDF8fHx8MTc3MDg2MjA0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'dog',
    lastSeenLocation: 'Parque Ibirapuera - Portão 10',
    lastSeenDate: '2026-02-13',
    description: 'Cachorro grande, preto e branco (Husky), muito peludo. Se assustou com fogos de artifício.',
    contactName: 'Pedro Alves',
    contactPhone: '(11) 96666-5555',
    found: true,
  },
  {
    id: '4',
    name: 'Mimi',
    photo: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBsb3N0fGVufDF8fHx8MTc3MDg2MjA0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    species: 'cat',
    lastSeenLocation: 'Vila Madalena',
    lastSeenDate: '2026-02-12',
    description: 'Gata laranja rajada, pequena, sem coleira. Muito assustada com barulhos.',
    contactName: 'Carla Mendes',
    contactPhone: '(11) 95555-4444',
    found: true,
  },
];

export default function LostAnimals() {
  const [lostAnimals, setLostAnimals] = useState<LostAnimal[]>(mockLostAnimals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [showForm, setShowForm] = useState(false);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [animalToConfirm, setAnimalToConfirm] = useState<{id: string, name: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat',
    lastSeenLocation: '',
    lastSeenDate: '',
    description: '',
    contactName: '',
    contactPhone: '',
    photoUrl: '',
  });

  const filteredAnimals = lostAnimals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || animal.species === filterSpecies;
    return matchesSearch && matchesSpecies && !animal.found;
  });

  const handleMarkAsFound = (id: string, name: string) => {
    setAnimalToConfirm({ id, name });
    setConfirmAlertOpen(true);
  };

  const confirmMarkAsFound = () => {
    if (animalToConfirm) {
        setLostAnimals((prev) =>
          prev.map((animal) => (animal.id === animalToConfirm.id ? { ...animal, found: true } : animal))
        );
        setAnimalToConfirm(null);
        setConfirmAlertOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: LostAnimal = {
      id: Date.now().toString(),
      name: formData.name,
      photo: formData.photoUrl || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBwbGFjZWhvbGRlcnxlbnwxfHx8fDE3NzA4NjIwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      species: formData.species,
      lastSeenLocation: formData.lastSeenLocation,
      lastSeenDate: formData.lastSeenDate,
      description: formData.description,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      found: false,
    };
    setLostAnimals((prev) => [newAnimal, ...prev]);
    setShowForm(false);
    setFormData({
      name: '',
      species: 'dog',
      lastSeenLocation: '',
      lastSeenDate: '',
      description: '',
      contactName: '',
      contactPhone: '',
      photoUrl: '',
    });
  };

  const ConfirmAlert = ({
    isOpen,
    onClose,
    onConfirm,
    animalName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    animalName: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmar</h3>
            <p className="text-gray-600 mb-6">
            Tem certeza que <span className="font-semibold">{animalName}</span> foi encontrado(a)?
            </p>
            <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
                Cancelar
            </Button>
            <Button 
                onClick={onConfirm}
                className="bg-green-600 text-white hover:bg-green-700"
            >
                Confirmar
            </Button>
            </div>
          </div>
        </div>
    );
};

const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');

    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
};

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-6">
        <ConfirmAlert
          isOpen={confirmAlertOpen}
          onClose={() => {
            setConfirmAlertOpen(false);
            setAnimalToConfirm(null);
          }}
          onConfirm={confirmMarkAsFound}
          animalName={animalToConfirm?.name || ''}
        />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Animais Perdidos</h1>
              <p className="text-gray-600 mt-2">
                Ajude a reunir animais perdidos com suas famílias
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="flex items-center text-white bg-black hover:bg-gray-900">
              {showForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Reportar Animal Perdido
                </>
              )}
            </Button>
          </div>

          {showForm && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Reportar Animal Perdido</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Animal</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Rex"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={formData.species}
                      onChange={(e) =>
                        setFormData({ ...formData, species: e.target.value as 'dog' | 'cat' })
                      }
                    >
                      <option value="dog">Cachorro</option>
                      <option value="cat">Gato</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Local Visto pela Última Vez</label>
                    <Input
                      required
                      value={formData.lastSeenLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, lastSeenLocation: e.target.value })
                      }
                      placeholder="Ex: Praça da República"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <Input
                      required
                      type="date"
                      value={formData.lastSeenDate}
                      onChange={(e) =>
                        setFormData({ ...formData, lastSeenDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Seu Nome</label>
                    <Input
                      required
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({ ...formData, contactName: e.target.value })
                      }
                      placeholder="Nome para contato"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <Input
                      required
                      value={formData.contactPhone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setFormData({ ...formData, contactPhone: formatted });
                      }}
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">URL da Foto (opcional)</label>
                    <Input
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Descreva características do animal, comportamento, etc."
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900">
                  Publicar
                </Button>
              </form>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nome ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterSpecies === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterSpecies('all')}
                className={filterSpecies === 'all' ? 'bg-black text-white hover:bg-gray-900' : ''}
              >
                Todos
              </Button>
              <Button
                variant={filterSpecies === 'dog' ? 'default' : 'outline'}
                onClick={() => setFilterSpecies('dog')}
                className={filterSpecies === 'dog' ? 'bg-black text-white hover:bg-gray-900' : ''}
              >
                Cachorros
              </Button>
              <Button
                variant={filterSpecies === 'cat' ? 'default' : 'outline'}
                onClick={() => setFilterSpecies('cat')}
                className={filterSpecies === 'cat' ? 'bg-black text-white hover:bg-gray-900' : ''}
              >
                Gatos
              </Button>
            </div>
          </div>
        </div>

        {filteredAnimals.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Nenhum animal perdido encontrado com esses filtros.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={animal.photo}
                    alt={animal.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className="absolute top-2 right-2 bg-black text-white"
                    variant={animal.species === 'dog' ? 'default' : 'secondary'}
                  >
                    {animal.species === 'dog' ? 'Cachorro' : 'Gato'}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-3">{animal.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{animal.lastSeenLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>
                        {new Date(animal.lastSeenDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {animal.description}
                  </p>

                  <div className="border-t pt-4 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Contato:</span> {animal.contactName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${animal.contactPhone}`}
                        className="text-orange-600 hover:underline"
                      >
                        {animal.contactPhone}
                      </a>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => handleMarkAsFound(animal.id, animal.name)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Encontrado
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Animais Encontrados */}
        {lostAnimals.filter((a) => a.found).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              ✓ Animais Encontrados Recentemente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostAnimals
                .filter((a) => a.found)
                .map((animal) => (
                  <Card key={animal.id} className="overflow-hidden opacity-75">
                    <div className="relative">
                      <img
                        src={animal.photo}
                        alt={animal.name}
                        className="w-full h-48 object-cover grayscale"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        Encontrado
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{animal.name}</h3>
                      <p className="text-sm text-gray-600">
                        Encontrado! Entre em contato com {animal.contactName} para mais informações.
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
