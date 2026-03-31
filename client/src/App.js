import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import ViewPost from './pages/ViewPost';
import Account from './pages/Account';
import UserProfile from './pages/UserProfile';
import Chatbot from './pages/Chatbot';
 
import './styles/global.css';
 
function Footer() {
  const { t } = useLanguage();
  return (
    <footer style={{
      textAlign: 'center', padding: 'var(--space-lg)',
      fontSize: '0.8rem', color: 'var(--ink-400)',
      borderTop: '1px solid var(--ink-50)'
    }}>
      {t('footer_text')}
    </footer>
  );
}
 
function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
      <h1>404</h1>
      <p style={{ color: 'var(--ink-500)', marginTop: 'var(--space-md)' }}>{t('not_found')}</p>
    </div>
  );
}
 
function AppRoutes() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/post/:id" element={<ViewPost />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/create" element={
              <ProtectedRoute><CreatePost /></ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute><Account /></ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute><Chatbot /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
 
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}
 
export default App;