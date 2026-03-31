import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
 
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
 
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('login_title')}</h1>
        <p className="auth-card__subtitle">{t('login_subtitle')}</p>
        {error && <div className="alert alert--error">{t(error)}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">{t('login_email')}</label>
            <input id="email" type="email" className="form-input" placeholder="adresa@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">{t('login_password')}</label>
            <input id="password" type="password" className="form-input" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? t('login_loading') : t('login_button')}
          </button>
        </form>
        <p className="auth-card__footer">
          {t('login_no_account')} <Link to="/register">{t('login_create')}</Link>
        </p>
      </div>
    </div>
  );
}