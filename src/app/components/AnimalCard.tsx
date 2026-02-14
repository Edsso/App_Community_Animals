import { Link } from 'react-router';
import { Animal } from '../data/mockData';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, User, Syringe, Shield } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link to={`/animal/${animal.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer">
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          <img
            src={animal.photo}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{animal.name}</h3>
            <Badge className="bg-black text-white" variant={animal.species === 'dog' ? 'default' : 'secondary'}>
              {animal.species === 'dog' ? '🐶 Cachorro' : '🐱 Gato'}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center text-sm gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate">{animal.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="truncate">{animal.caretaker}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {animal.vaccinated ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Syringe className="w-3 h-3 mr-1" />
                Vacinado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                <Syringe className="w-3 h-3 mr-1" />
                Não vacinado
              </Badge>
            )}
            {animal.neutered && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Shield className="w-3 h-3 mr-1" />
                Castrado
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
