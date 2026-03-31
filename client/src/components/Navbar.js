import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BerryLogo from './BerryLogo';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, toggleLanguage } = useLanguage();
  const location = useLocation();
 
  const isActive = (path) => location.pathname === path;
 
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <BerryLogo size={32} />
          Berries
        </Link>
 
        <div className="navbar__links">
          <button onClick={toggleLanguage} className="navbar__link" title="Switch language">
            {t('lang_switch')}
          </button>
 
          <Link to="/feed" className={`navbar__link ${isActive('/feed') ? 'navbar__link--active' : ''}`}>
            ✦ <span>{t('nav_feed')}</span>
          </Link>
 
          {isAuthenticated ? (
            <>
              <Link to="/create" className={`navbar__link ${isActive('/create') ? 'navbar__link--active' : ''}`}>
                ✦ <span>{t('nav_new_post')}</span>
              </Link>
              <Link to="/chatbot" className={`navbar__link ${isActive('/chatbot') ? 'navbar__link--active' : ''}`}>
                ✦ <span>{t('nav_chatbot')}</span>
              </Link>
              <Link to="/account" className={`navbar__link ${isActive('/account') ? 'navbar__link--active' : ''}`}>
                {user?.avatarUrl ? (
                  <img
                    src={`${API_BASE}${user.avatarUrl}`}
                    alt=""
                    style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle', marginRight: 4 }}
                  />
                ) : '◉ '}
                <span>{user?.username}</span>
              </Link>
              <button onClick={logout} className="navbar__link">
                ❌ <span>{t('nav_logout')}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`navbar__link ${isActive('/login') ? 'navbar__link--active' : ''}`}>
                {t('nav_login')}
              </Link>
              <Link to="/register" className="btn btn--primary btn--small">
                {t('nav_register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}