import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import NotFound from './pages/NotFound';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Search from './pages/Search';
import NotLoggedIn from './pages/NotLoggedIn';
import UserProfile from './pages/UserProfile';
import MyList from './pages/MyList';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tv-shows" element={<TVShows />} />
      <Route path="/login" element={<Login />} />
      <Route path="/not-logged-in" element={<NotLoggedIn />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/favorites" 
        element={
          <ProtectedRoute>
            <UserProfile activeTab="favorites" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/watchlist" 
        element={
          <ProtectedRoute>
            <UserProfile activeTab="watchlist" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-list" 
        element={
          <ProtectedRoute>
            <MyList />
          </ProtectedRoute>
        } 
      />
      <Route path="/:movieSlug" element={<MovieDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;