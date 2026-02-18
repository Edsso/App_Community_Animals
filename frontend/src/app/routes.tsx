import { createBrowserRouter, Navigate } from 'react-router';
import Login from './pages/Login';
import AnimalList from './pages/AnimalList';
import AnimalForm from './pages/AnimalForm';
import AnimalProfile from './pages/AnimalProfile';
import LostAnimals from './pages/LostAnimals';
import MapView from './pages/MapView';
import ProtectedLayout from './pages/ProtectedLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: ProtectedLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/animals" replace />,
      },
      {
        path: 'animals',
        Component: AnimalList,
      },
      {
        path: 'animal/new',
        Component: AnimalForm,
      },
      {
        path: 'animal/:id',
        Component: AnimalProfile,
      },
      {
        path: 'animal/:id/edit',
        Component: AnimalForm,
      },
      {
        path: 'map',
        Component: MapView,
      },
      {
        path: 'lost',
        Component: LostAnimals,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/animals" replace />,
  },
]);
