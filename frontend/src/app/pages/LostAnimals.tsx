import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatPhoneInput, cleanPhoneNumber, formatPhoneDisplay } from '../components/ui/formatters';
import { Search, MapPin, Calendar, Phone, CheckCircle, X, Plus } from 'lucide-react';
import { lostService, LostAnimal, LostAnimalCreate } from '../services/lost';
import { toast } from 'sonner';

export default function LostAnimals() {
  const [perdidos, setPerdidos] = useState<LostAnimal[]>([]);
  const [encontrados, setEncontrados] = useState<LostAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [showForm, setShowForm] = useState(false);
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [animalToConfirm, setAnimalToConfirm] = useState<{id: number, name: string} | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat',
    last_seen_location: '',
    last_seen_date: '',
    description: '',
    contact_name: '',
    contact_phone: '',
    photo: '',
  });

  // Carregar dados da API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [perdidosData, encontradosData] = await Promise.all([
        lostService.listarPerdidos(),
        lostService.listarEncontrados()
      ]);
      setPerdidos(perdidosData);
      setEncontrados(encontradosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar animais perdidos');
    } finally {
      setLoading(false);
    }
  };

  const filteredAnimals = perdidos.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.last_seen_location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || animal.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const handleMarkAsFound = (id: number, name: string) => {
    setAnimalToConfirm({ id, name });
    setConfirmAlertOpen(true);
  };

  const confirmMarkAsFound = async () => {
    if (animalToConfirm) {
      try {
        await lostService.marcarEncontrado(animalToConfirm.id);
        
        // Mover da lista de perdidos para encontrados
        const animal = perdidos.find(a => a.id === animalToConfirm.id);
        if (animal) {
          setPerdidos(prev => prev.filter(a => a.id !== animalToConfirm.id));
          setEncontrados(prev => [{ ...animal, found: true }, ...prev]);
        }
        
        toast.success(`${animalToConfirm.name} marcado como encontrado!`);
      } catch (error) {
        console.error('Erro ao marcar como encontrado:', error);
        toast.error('Erro ao marcar como encontrado');
      } finally {
        setAnimalToConfirm(null);
        setConfirmAlertOpen(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newAnimal: LostAnimalCreate = {
        name: formData.name,
        photo: formData.photo || null,
        species: formData.species,
        last_seen_location: formData.last_seen_location,
        last_seen_date: formData.last_seen_date,
        description: formData.description,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone.replace(/\D/g, ''),
      };

      const created = await lostService.reportar(newAnimal);
      setPerdidos(prev => [created, ...prev]);
      
      setShowForm(false);
      setFormData({
        name: '',
        species: 'dog',
        last_seen_location: '',
        last_seen_date: '',
        description: '',
        contact_name: '',
        contact_phone: '',
        photo: '',
      });
      
      toast.success('Animal perdido reportado com sucesso!');
    } catch (error) {
      console.error('Erro ao reportar:', error);
      toast.error('Erro ao reportar animal perdido');
    }
  };

  const ConfirmAlert = ({ isOpen, onClose, onConfirm, animalName }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    animalName: string;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirmar</h3>
          <p className="text-gray-600 mb-6">
            Tem certeza que <span className="font-semibold">{animalName}</span> foi encontrado(a)?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} className="bg-green-600 text-white hover:bg-green-700">
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-6 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
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
                      value={formData.last_seen_location}
                      onChange={(e) =>
                        setFormData({ ...formData, last_seen_location: e.target.value })
                      }
                      placeholder="Ex: Praça da República"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data</label>
                    <Input
                      required
                      type="date"
                      value={formData.last_seen_date}
                      onChange={(e) =>
                        setFormData({ ...formData, last_seen_date: e.target.value })
                      }
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Seu Nome</label>
                    <Input
                      required
                      value={formData.contact_name}
                      onChange={(e) =>
                        setFormData({ ...formData, contact_name: e.target.value })
                      }
                      placeholder="Nome para contato"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <Input
                      required
                      value={formData.contact_phone}
                      onChange={(e) => {
                        const formatted = formatPhoneInput(e.target.value);
                        setFormData({ ...formData, contact_phone: formatted });
                      }}
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">URL da Foto (opcional)</label>
                    <Input
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
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
                    src={animal.photo || 'https://via.placeholder.com/300'}
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
                      <span>{animal.last_seen_location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>
                        {new Date(animal.last_seen_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {animal.description}
                  </p>

                  <div className="border-t pt-4 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Contato:</span> {animal.contact_name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${cleanPhoneNumber(animal.contact_phone)}`}
                        className="text-orange-600 hover:underline"
                      >
                        {formatPhoneDisplay(animal.contact_phone)}
                      </a>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-green-600 text-white hover:bg-green-700"
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

        {/* Recently Found Animals */}
        {encontrados.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              ✓ Animais Encontrados Recentemente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {encontrados.map((animal) => (
                <Card key={animal.id} className="overflow-hidden opacity-75">
                  <div className="relative">
                    <img
                      src={animal.photo || 'https://via.placeholder.com/300'}
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
                      Encontrado! Entre em contato com {animal.contact_name} pelo telefone {formatPhoneDisplay(animal.contact_phone)} para mais informações.
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