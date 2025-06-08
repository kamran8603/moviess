import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewAndPopular = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToTrending: true } });
    }
  };

  const navigationLinks = [
    { text: 'Home', href: '/' },
    { text: 'Movies', href: '/movies' },
    { text: 'TV Shows', href: '/tv-shows' },
    { text: 'New & Popular', href: '#trending', action: handleNewAndPopular },
    { text: 'My List', href: '/my-list' }
  ];

  const legalLinks = [
    { text: 'Terms of Use', href: '/terms' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Cookie Preferences', href: '/cookies' }
  ];

  const helpLinks = [
    { text: 'Account', href: '/account' },
    { text: 'Media Center', href: '/media' },
    { text: 'Contact Us', href: '/contact' },
    { text: 'Gift Cards', href: '/gift-cards' }
  ];

  return (
    <footer className="py-10 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="inline-block">
              <h2 className="text-lg font-bold mb-4">
                <span className="text-[#f3d100] dark:text-moviebuster-red">MOVIEBUSTER</span>
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your ultimate streaming destination for all the best movies and TV shows.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn title="Navigation" links={navigationLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
            <FooterColumn title="Help" links={helpLinks} />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-muted flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MovieBuster. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <SocialIcon icon="facebook" />
            <SocialIcon icon="twitter" />
            <SocialIcon icon="instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3 className="font-medium mb-2">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            {link.action ? (
              <button 
                onClick={link.action}
                className="text-sm text-muted-foreground hover:text-[#f3d100] dark:hover:text-moviebuster-red transition-colors"
              >
                {link.text}
              </button>
            ) : (
              <Link 
                to={link.href}
                className="text-sm text-muted-foreground hover:text-[#f3d100] dark:hover:text-moviebuster-red transition-colors"
              >
                {link.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({ icon }) => (
  <a 
    href="#" 
    className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
  >
    <span className="sr-only">{icon}</span>
    <div className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" aria-hidden="true">
      {/* Simple placeholder for social icons */}
      {icon === "facebook" && <FacebookIcon />}
      {icon === "twitter" && <TwitterIcon />}
      {icon === "instagram" && <InstagramIcon />}
    </div>
  </a>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export default Footer;
