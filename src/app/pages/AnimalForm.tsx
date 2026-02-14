import { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAnimals } from '../contexts/AnimalContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { ArrowLeft, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function AnimalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAnimal, getAnimal, updateAnimal } = useAnimals();
  const isEditing = id && id !== 'new';
  const existingAnimal = isEditing ? getAnimal(id) : null;

  const [formData, setFormData] = useState({
    name: existingAnimal?.name || '',
    photo: existingAnimal?.photo || '',
    species: existingAnimal?.species || 'dog',
    location: existingAnimal?.location || '',
    coordinates: existingAnimal?.coordinates || { lat: -23.5505, lng: -46.6333 },
    caretaker: existingAnimal?.caretaker || '',
    caretakerContact: existingAnimal?.caretakerContact || '',
    vaccinated: existingAnimal?.vaccinated || false,
    vaccineDetails: existingAnimal?.vaccineDetails || '',
    neutered: existingAnimal?.neutered || false,
    description: existingAnimal?.description || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.caretaker) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (isEditing && existingAnimal) {
      updateAnimal(id, {
        ...formData,
        dateAdded: existingAnimal.dateAdded,
      });
      toast.success('Animal atualizado com sucesso!');
    } else {
        const animalWithDate = {
            ...formData,
            dateAdded: new Date().toISOString(),
        };

      addAnimal(animalWithDate);
      toast.success('Animal cadastrado com sucesso!');
    }

    navigate('/animals');
  };

  const handlePhotoUrlChange = (url: string) => {
    setFormData({ ...formData, photo: url });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/animals')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Editar Animal' : 'Cadastrar Novo Animal'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Foto */}
              <div className="space-y-2">
                <Label>Foto do Animal</Label>
                {formData.photo ? (
                  <div className="relative">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handlePhotoUrlChange('')}
                    >
                      Trocar foto
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-4">
                      Adicione a URL da foto do animal
                    </p>
                    <Input
                      placeholder="https://exemplo.com/foto.jpg"
                      value={formData.photo}
                      onChange={(e) => handlePhotoUrlChange(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Nome e Espécie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome/Apelido *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Espécie *</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value: 'dog' | 'cat') =>
                      setFormData({ ...formData, species: value })
                    }
                  >
                    <SelectTrigger id="species">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="dog">🐶 Cachorro</SelectItem>
                      <SelectItem value="cat">🐱 Gato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="location">Local onde vive *</Label>
                <Input
                  id="location"
                  placeholder="Ex: Praça das Figueiras, próximo ao Posto de Gasolina"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              {/* Cuidador */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caretaker">Quem cuida *</Label>
                  <Input
                    id="caretaker"
                    placeholder="Nome do cuidador"
                    value={formData.caretaker}
                    onChange={(e) =>
                      setFormData({ ...formData, caretaker: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caretakerContact">Contato (opcional)</Label>
                  <Input
                    id="caretakerContact"
                    placeholder="(11) 98765-4321"
                    value={formData.caretakerContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        caretakerContact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Vacinação */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="vaccinated">Vacinado</Label>
                    <p className="text-sm text-gray-500">
                      O animal está com as vacinas em dia?
                    </p>
                  </div>
                  <Switch
                    className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                    id="vaccinated"
                    checked={formData.vaccinated}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, vaccinated: checked,
                        vaccineDetails: checked ? formData.vaccineDetails : ''
                       })
                    }
                  />
                </div>

                {formData.vaccinated && (
                  <div className="space-y-2">
                    <Label htmlFor="vaccineDetails">Detalhes das vacinas</Label>
                    <Textarea
                      id="vaccineDetails"
                      placeholder="Ex: Antirrábica (Jan/2026), V10 (Dez/2025)"
                      value={formData.vaccineDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vaccineDetails: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Castração */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="neutered">Castrado</Label>
                  <p className="text-sm text-gray-500">
                    O animal foi castrado?
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                  id="neutered"
                  checked={formData.neutered}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, neutered: checked })
                  }
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Conte mais sobre o animal: comportamento, características, rotina..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/animals')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-900">
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Animal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
