import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../components/PostCard';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
export default function Feed() {
  const { token, user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
 
  const fetchPosts = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
 
      const res = await fetch(`${API_BASE}/api/posts?page=${pageNum}&limit=20`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || 'Error');
    }
    setLoading(false);
  }, [token]);
 
  useEffect(() => { fetchPosts(page); }, [page, fetchPosts]);
 
  const handleDelete = (postId) => setPosts(posts.filter(p => p._id !== postId));
 
  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
        <h1>{t('feed_title')}</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--ink-400)', fontStyle: 'italic' }}>
          {t('feed_chronological')}
        </span>
      </div>
 
      {user?.interests?.length > 0 && (
        <div style={{
          padding: 'var(--space-sm) var(--space-md)',
          background: 'var(--berry-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--berry-100)',
          marginBottom: 'var(--space-lg)',
          fontSize: '0.85rem',
          color: 'var(--berry-700)'
        }}>
          ✦ {t('feed_filtered_by')}: {user.interests.map(i => t('tag_' + i)).join(', ')}
        </div>
      )}
 
      {error && <div className="alert alert--error">{t(error)}</div>}
 
      {loading ? (
        <div className="loading-spinner"><div className="loading-spinner__circle" /></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🫐</div>
          <p>{t('feed_empty')}</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xl)' }}>
              <button className="btn btn--secondary btn--small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                {t('feed_prev')}
              </button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--ink-500)', padding: '0 var(--space-md)' }}>
                {page} / {totalPages}
              </span>
              <button className="btn btn--secondary btn--small" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                {t('feed_next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}