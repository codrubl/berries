import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Avatar from './Avatar';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
function useTimeAgo() {
  const { t } = useLanguage();
 
  return (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return t('post_seconds_ago');
    if (seconds < 3600) return t('post_minutes_ago', { n: Math.floor(seconds / 60) });
    if (seconds < 86400) return t('post_hours_ago', { n: Math.floor(seconds / 3600) });
    if (seconds < 604800) return t('post_days_ago', { n: Math.floor(seconds / 86400) });
    return new Date(dateString).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
  };
}
 
export default function PostCard({ post, onDelete }) {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const timeAgo = useTimeAgo();
  const isOwner = user && post.author && user._id === post.author._id;
 
  const handleDelete = async () => {
    if (!window.confirm(t('post_delete_confirm'))) return;
    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok && onDelete) onDelete(post._id);
    } catch (error) {
      console.error('Error:', error);
    }
  };
 
  return (
    <article className="post-card">
      <div className="post-card__header">
        <Avatar
          username={post.author?.username}
          avatarUrl={post.author?.avatarUrl}
          size={44}
        />
        <div className="post-card__meta">
          <Link to={`/user/${post.author?._id}`} className="post-card__author">
            {post.author?.username || t('post_anonymous')}
          </Link>
          <div className="post-card__time">{timeAgo(post.createdAt)}</div>
        </div>
      </div>
 
      <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="post-card__content">{post.content}</div>
        {post.imageUrl && (
          <img src={`${API_BASE}${post.imageUrl}`} alt="" className="post-card__image" />
        )}
      </Link>
 
      {post.tags && post.tags.length > 0 && (
        <div style={{ padding: '0 var(--space-lg)', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              padding: '0.15rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--berry-50)',
              color: 'var(--berry-700)',
              fontSize: '0.75rem',
              fontWeight: 500,
              border: '1px solid var(--berry-100)'
            }}>
              {t('tag_' + tag)}
            </span>
          ))}
        </div>
      )}
 
      <div className="post-card__actions">
        <Link to={`/post/${post._id}`} className="btn btn--ghost btn--small">
          💬 {t('post_comments')}
        </Link>
        {post.author?.walletAddress && (
          <Link to={`/post/${post._id}`} className="btn btn--ghost btn--small">
            💰 {t('post_donate')}
          </Link>
        )}
        {isOwner && (
          <button onClick={handleDelete} className="btn btn--ghost btn--small"
            style={{ marginLeft: 'auto', color: 'var(--error)' }}>
            🗑 {t('post_delete')}
          </button>
        )}
      </div>
    </article>
  );
}