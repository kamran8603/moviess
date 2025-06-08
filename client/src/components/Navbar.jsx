import React, { useState, useEffect } from 'react';
import { User, Menu } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import UserDropdown from './UserDropdown';

const Navbar = ({ onNewClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const username = userData.username || 'User';

  const handleSearchResults = (results) => {
    // Handle search results here
    console.log('Search results:', results);
  };
  
  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md bg-black/10 ${
        isScrolled 
          ? 'bg-black/40 shadow-lg' 
          : 'bg-gradient-to-b from-black/30 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo with Link */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#f3d100] dark:text-moviebuster-red">MOVIEBUSTER</span>
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks mobile={false} onNewClick={onNewClick} isAuthenticated={isAuthenticated} />
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <SearchBar onSearchResults={handleSearchResults} />
          
          <ThemeToggle />
          
          <button 
            onClick={handleAuthClick}
            className="p-1 rounded-full hover:ring-2 hover:ring-white/70 transition-all duration-200"
          >
            {isAuthenticated ? (
              <div className="w-8 h-8 rounded-full bg-[#f3d100] dark:bg-moviebuster-red flex items-center justify-center">
                <span className="text-sm font-bold text-[#000e3d] dark:text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <User className="h-6 w-6 text-white/90 hover:text-white transition-colors" />
            )}
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-1 rounded-full hover:bg-gray-700/50 transition-colors"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5 text-white/90 hover:text-white transition-colors" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full w-full bg-moviebuster-darkblue shadow-md transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-60' : 'max-h-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-4 py-2 flex flex-col">
          <NavLinks mobile={true} onNewClick={onNewClick} isAuthenticated={isAuthenticated} />
        </div>
      </div>

      {/* User Dropdown */}
      {isAuthenticated && (
        <UserDropdown 
          isOpen={isDropdownOpen} 
          onClose={() => setIsDropdownOpen(false)} 
        />
      )}
    </nav>
  );
};

const NavLinks = ({ mobile = false, onNewClick, isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNewAndPopular = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToTrending: true } });
    } else {
      onNewClick();
    }
    if (mobile) setIsMobileMenuOpen(false);
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'New & Popular', path: '#trending', action: handleNewAndPopular },
    { name: 'My List', path: isAuthenticated ? '/my-list' : '/not-logged-in' }
  ];
  
  return (
    <>
      {links.map((link) => (
        link.action ? (
          <button
            key={link.path}
            onClick={link.action}
            className={`transition-colors hover:text-[#f3d100] dark:hover:text-moviebuster-red text-white/90
              ${mobile ? 'py-3 border-b border-border w-full text-left' : ''}`}
          >
            {link.name}
          </button>
        ) : (
          <NavLink
            key={link.path}
            to={link.path}
            className={`transition-colors hover:text-[#f3d100] dark:hover:text-moviebuster-red text-white/90
              ${mobile ? 'py-3 border-b border-border' : ''}`}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
          >
            {link.name}
          </NavLink>
        )
      ))}
    </>
  );
};

export default Navbar;
