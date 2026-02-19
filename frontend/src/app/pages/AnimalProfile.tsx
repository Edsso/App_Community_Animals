import { useParams, useNavigate, Link } from 'react-router';
import { useAnimals } from '../contexts/AnimalContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, MapPin, User, Phone, Syringe, Shield, Calendar, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { formatPhoneDisplay } from '../components/ui/formatters';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function AnimalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnimal, deleteAnimal } = useAnimals();
  const [loading, setLoading] = useState(true);
  const [animal, setAnimal] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Converte id para número, pois no backend é number
      const numericId = parseInt(id);
      const foundAnimal = getAnimal(numericId.toString());
      setAnimal(foundAnimal);
      setLoading(false);
    }
  }, [id, getAnimal]);

  const handleDelete = async () => {
    if (animal) {
      await deleteAnimal(animal.id.toString());
      toast.success('Animal removido com sucesso');
      navigate('/animals');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Animal não encontrado</p>
          <Button onClick={() => navigate('/animals')}>
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/animals')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da Foto */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden sticky top-24">
              <div className="aspect-3/4 bg-gray-100">
                <img
                  src={animal.photo || 'https://via.placeholder.com/300'}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Button 
                    className="flex-4 bg-black text-white hover:bg-gray-800"
                    asChild
                  >
                    <Link to={`/animal/${animal.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center px-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white rounded-lg shadow-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover animal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. O registro de{' '}
                          {animal.name} será removido permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className='bg-red-600 hover:bg-red-700 text-white'>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna das Informações */}
          <div className="md:col-span-2 space-y-6">
            {/* Cabeçalho */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold">{animal.name}</h1>
                  <Badge
                    variant={animal.species === 'dog' ? 'default' : 'secondary'}
                    className="text-base px-3 py-1"
                  >
                    {animal.species === 'dog' ? '🐕 Cachorro' : '🐱 Gato'}
                  </Badge>
                </div>

                {animal.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {animal.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Localização */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Localização
                </h2>
                <p className="text-gray-700">{animal.location}</p>
                <div className="mt-4 bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">
                      Lat: {animal.latitude?.toFixed(4) || animal.coordinates?.lat?.toFixed(4)}, 
                      Lng: {animal.longitude?.toFixed(4) || animal.coordinates?.lng?.toFixed(4)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cuidador */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Cuidador
                </h2>
                <p className="text-gray-700 mb-2">{animal.caretaker}</p>
                {animal.caretaker_contact && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${animal.caretaker_contact.replace(/\D/g, '')}`}>
                      {formatPhoneDisplay(animal.caretaker_contact)}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saúde */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Informações de Saúde</h2>
                <div className="space-y-4">
                  {/* Vacinação */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        animal.vaccinated ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      <Syringe
                        className={`w-5 h-5 ${
                          animal.vaccinated ? 'text-green-600' : 'text-red-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {animal.vaccinated ? 'Vacinado' : 'Não vacinado'}
                      </p>
                      {animal.vaccinated && animal.vaccine_details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {animal.vaccine_details}
                        </p>
                      )}
                      {!animal.vaccinated && (
                        <p className="text-sm text-gray-600 mt-1">
                          Este animal ainda precisa ser vacinado
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Castração */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        animal.neutered ? 'bg-blue-100' : 'bg-gray-100'
                      }`}
                    >
                      <Shield
                        className={`w-5 h-5 ${
                          animal.neutered ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {animal.neutered ? 'Castrado' : 'Não castrado'}
                      </p>
                      {!animal.neutered && (
                        <p className="text-sm text-gray-600 mt-1">
                          A castração é importante para o controle populacional
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data de Cadastro */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Cadastrado em {formatDate(animal.date_added || animal.dateAdded)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}