import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { PawPrint, List, Map, LogOut, Plus } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/animals" className="flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-orange-500" />
            <span className="font-semibold text-lg">Animais Comunitários</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/animals">
                <List className="w-4 h-4 mr-2" />
                Lista
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/map">
                <Map className="w-4 h-4 mr-2" />
                Mapa
              </Link>
            </Button>
            <Button variant="default" size="sm" asChild className='bg-black text-white hover:bg-gray-900'>
              <Link to="/animal/new">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
