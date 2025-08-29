import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../custom/LanguageSwitcher';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://admin.gahoishakti.in'
  : 'http://localhost:1340';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const hindiTextClass = i18n.language === "hi" 
    ? "text-base lg:text-lg font-hindi" 
    : "text-sm md:text-xs lg:text-base font-english";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const verifiedMobile = localStorage.getItem('verifiedMobile');
      
      // Check if user is viewing a family profile (which means they're effectively "logged in")
      const currentPath = window.location.pathname;
      const isFamilyProfilePage = currentPath.includes('/profile/document/');
      
      // Consider user authenticated if they have token/mobile OR are viewing a family profile
      if ((token && verifiedMobile) || isFamilyProfilePage) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Listen for route changes to update auth state
    const handleRouteChange = () => {
      checkAuth();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('verifiedMobile');
    localStorage.removeItem('documentId'); 
    localStorage.removeItem('mobile');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('authMobile');
    localStorage.removeItem('loggedInMobile');

    
    sessionStorage.clear();

    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  const getMyAccountLink = () => {
    const currentPath = window.location.pathname;
    const isFamilyProfilePage = currentPath.includes('/profile/document/');
    
    if (isFamilyProfilePage) {
      
      return currentPath;
    } else {
      
      return '/my-account';
    }
  };

  const menuItems = [
    { to: '/', label: t('navigation.home') },
    { to: '/about-us', label: t('navigation.about') },
    { to: '/our-team', label: t('navigation.team', 'Our Team') },
    { to: '/contact-us', label: t('navigation.contact') },
    { to: '/gau-seva', label: t('navigation.gauseva') },
    { to: '/gotra-aankna', label: t('navigation.gotraankna') },
    // Always show Search People for authenticated users (including family profile )
    ...(isAuthenticated ? [{ to: '/find-people', label: t('navigation.search', 'Search People') }] : []),
  ];

  return (
    <header className='bg-[#800000]'>
      <nav className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Gahoi Logo" 
              className="h-20 md:h-24 lg:h-28 w-auto object-contain"
            />
          </Link>

          {/* MyAccount login and logout*/}
          <div className="hidden md:flex items-center space-x-4 absolute top-2 right-16">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 text-sm">
                <Link
                  to={getMyAccountLink()}
                  className="text-white hover:text-yellow-300 transition-colors duration-300 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{t('navigation.myAccount', 'My Account')}</span>
                </Link>
                <div className="h-4 w-px bg-white/40"></div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-300 transition-colors duration-300 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('navigation.logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-yellow-300 transition-colors duration-300 flex items-center space-x-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>{t('navigation.login')}</span>
              </Link>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`${hindiTextClass} text-white hover:text-yellow-300 transition-colors duration-300 font-medium relative group px-1`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
            
            {/* Language  */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)}></div>
              <div 
                ref={dropdownRef}
                className="fixed inset-y-0 right-0 w-80 bg-[#800000] z-50 shadow-2xl"
              >
                <div className="p-6">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-8">
                    <img 
                      src="/logo.png" 
                      alt="Gahoi Logo" 
                      className="h-12 w-auto object-contain"
                    />
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:text-yellow-300 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Items */}
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`${hindiTextClass} text-white hover:text-yellow-300 block px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    
                    {isAuthenticated ? (
                      <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
                        <Link 
                          to={getMyAccountLink()} 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center text-white hover:text-yellow-300 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {t('navigation.myAccount', 'My Account')}
                        </Link>
                        <button 
                          onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                          className="flex items-center text-white hover:text-yellow-300 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 w-full text-left"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t('navigation.logout')}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <Link
                          to="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center text-white hover:text-yellow-300 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          {t('navigation.login')}
                        </Link>
                      </div>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
