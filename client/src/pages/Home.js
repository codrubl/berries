import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BerryLogo from '../components/BerryLogo';
 
export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
 
  return (
    <div className="landing">
      <div className="landing__icon">
        <BerryLogo size={80} />
      </div>
      <h1 className="landing__title">{t('landing_title')}</h1>
      <p className="landing__subtitle">{t('landing_subtitle')}</p>
 
      <div className="landing__cta">
        {isAuthenticated ? (
          <Link to="/feed" className="btn btn--primary">{t('landing_go_feed')} ✦</Link>
        ) : (
          <>
            <Link to="/register" className="btn btn--primary">{t('landing_create_account')}</Link>
            <Link to="/login" className="btn btn--secondary">{t('landing_have_account')}</Link>
          </>
        )}
      </div>
 
      <div className="landing__features">
        <div className="landing__feature">
          <div className="landing__feature-icon">🚫</div>
          <h3>{t('landing_feat1_title')}</h3>
          <p>{t('landing_feat1_desc')}</p>
        </div>
        <div className="landing__feature">
          <div className="landing__feature-icon">💸</div>
          <h3>{t('landing_feat2_title')}</h3>
          <p>{t('landing_feat2_desc')}</p>
        </div>
        <div className="landing__feature">
          <div className="landing__feature-icon">🤖</div>
          <h3>{t('landing_feat3_title')}</h3>
          <p>{t('landing_feat3_desc')}</p>
        </div>
      </div>
    </div>
  );
}