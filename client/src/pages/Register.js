import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
 
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError(t('register_password_mismatch')); return; }
    if (password.length < 6) { setError(t('register_password_short')); return; }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
 
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">{t('register_title')}</h1>
        <p className="auth-card__subtitle">{t('register_subtitle')}</p>
        {error && <div className="alert alert--error">{t(error)}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">{t('register_username')}</label>
            <input id="username" type="text" className="form-input" placeholder="numele_tau"
              value={username} onChange={(e) => setUsername(e.target.value)} minLength={3} maxLength={30} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">{t('register_email')}</label>
            <input id="email" type="email" className="form-input" placeholder="adresa@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">{t('register_password')}</label>
            <input id="password" type="password" className="form-input" placeholder={t('register_password_hint')}
              value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">{t('register_confirm')}</label>
            <input id="confirmPassword" type="password" className="form-input" placeholder={t('register_confirm_hint')}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? t('register_loading') : t('register_button')}
          </button>
        </form>
        <p className="auth-card__footer">
          {t('register_have_account')} <Link to="/login">{t('register_login')}</Link>
        </p>
      </div>
    </div>
  );
}