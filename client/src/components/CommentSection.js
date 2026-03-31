import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Avatar from './Avatar';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return new Date(dateString).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}
 
export default function CommentSection({ postId, comments: initialComments }) {
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;
    setLoading(true);
    setError('');
 
    try {
      const res = await fetch(`${API_BASE}/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setComments([data.comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
 
  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };
 
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
        {t('comments_title')} ({comments.length})
      </h3>
 
      {isAuthenticated && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="comment-form__input"
            placeholder={t('comments_placeholder')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={1000}
          />
          <button type="submit" className="btn btn--primary btn--small" disabled={loading || !newComment.trim()}>
            {loading ? '...' : t('comments_send')}
          </button>
        </form>
      )}
 
      {error && <div className="alert alert--error" style={{ marginTop: 'var(--space-md)' }}>{t(error)}</div>}
 
      {!isAuthenticated && (
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-500)', padding: 'var(--space-md) 0' }}>
          {t('comments_login')}
        </p>
      )}
 
      <div style={{ marginTop: 'var(--space-md)' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--ink-400)', fontSize: '0.9rem', padding: 'var(--space-md) 0' }}>
            {t('comments_empty')}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <Avatar
                username={comment.author?.username}
                avatarUrl={comment.author?.avatarUrl}
                size={34}
                className="comment__avatar"
              />
              <div className="comment__body">
                <div className="comment__header">
                  <span className="comment__author">{comment.author?.username}</span>
                  <span className="comment__time">{timeAgo(comment.createdAt)}</span>
                  {user && comment.author && user._id === comment.author._id && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="btn btn--ghost btn--small"
                      style={{ marginLeft: 'auto', color: 'var(--error)', padding: '0 var(--space-sm)', fontSize: '0.75rem' }}
                    >
                      {t('comments_delete')}
                    </button>
                  )}
                </div>
                <p className="comment__text">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}