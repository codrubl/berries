import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Avatar from '../components/Avatar';
import CommentSection from '../components/CommentSection';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
const AVAILABLE_TAGS = [
  'sport', 'gaming', 'art', 'movies', 'memes',
  'technology', 'politics', 'music', 'food',
  'travel', 'science', 'education'
];
 
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ro-RO', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
 
export default function ViewPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  // Tag editing state
  const [editingTags, setEditingTags] = useState(false);
  const [editTags, setEditTags] = useState([]);
  const [savingTags, setSavingTags] = useState(false);
 
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPost(data.post);
        setComments(data.comments);
      } catch (err) { setError(err.message); }
      setLoading(false);
    };
    fetchPost();
  }, [id]);
 
  const handleDelete = async () => {
    if (!window.confirm(t('post_delete_confirm'))) return;
    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) navigate('/feed');
    } catch (err) { console.error(err); }
  };
 
  const startEditTags = () => {
    setEditTags(post?.tags || []);
    setEditingTags(true);
  };
 
  const toggleTag = (tag) => {
    setEditTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
 
  const saveTags = async () => {
    setSavingTags(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tags: editTags })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPost(data.post);
      setEditingTags(false);
    } catch (err) {
      console.error(err);
    }
    setSavingTags(false);
  };
 
  if (loading) return <div className="page-container"><div className="loading-spinner"><div className="loading-spinner__circle" /></div></div>;
 
  if (error || !post) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">😔</div>
          <p>{error || t('post_not_found')}</p>
          <Link to="/feed" className="btn btn--secondary" style={{ marginTop: 'var(--space-lg)' }}>{t('post_back')}</Link>
        </div>
      </div>
    );
  }
 
  const isOwner = user && post.author && user._id === post.author._id;
 
  return (
    <div className="page-container">
      <Link to="/feed" className="btn btn--ghost" style={{ marginBottom: 'var(--space-lg)' }}>{t('post_back')}</Link>
 
      <article className="card">
        <div className="card__body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <Avatar username={post.author?.username} avatarUrl={post.author?.avatarUrl} size={52} />
            <div>
              <Link to={`/user/${post.author?._id}`} className="post-card__author" style={{ fontSize: '1.05rem' }}>
                {post.author?.username}
              </Link>
              <div className="post-card__time">{formatDate(post.createdAt)}</div>
            </div>
            {isOwner && (
              <button onClick={handleDelete} className="btn btn--ghost btn--small"
                style={{ marginLeft: 'auto', color: 'var(--error)' }}>
                🗑 {t('post_delete')}
              </button>
            )}
          </div>
 
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--ink-800)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 'var(--space-lg)' }}>
            {post.content}
          </div>
 
          {post.imageUrl && (
            <img src={`${API_BASE}${post.imageUrl}`} alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }} />
          )}
 
          {!editingTags && post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: 'var(--space-lg)', alignItems: 'center' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  padding: '0.2rem 0.7rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--berry-50)',
                  color: 'var(--berry-700)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: '1px solid var(--berry-100)'
                }}>
                  {t('tag_' + tag)}
                </span>
              ))}
              {isOwner && (
                <button onClick={startEditTags} className="btn btn--ghost btn--small" style={{ fontSize: '0.8rem' }}>
                  ✎ {t('post_edit_tags')}
                </button>
              )}
            </div>
          )}
 
          {!editingTags && (!post.tags || post.tags.length === 0) && isOwner && (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <button onClick={startEditTags} className="btn btn--secondary btn--small">
                + {t('post_add_tags')}
              </button>
            </div>
          )}
 
          {editingTags && (
            <div style={{
              marginBottom: 'var(--space-lg)',
              padding: 'var(--space-md)',
              background: 'var(--ink-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-100)'
            }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)', marginBottom: 'var(--space-sm)' }}>
                {t('post_select_tags')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: 'var(--space-md)' }}>
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-full)',
                      border: editTags.includes(tag) ? '2px solid var(--berry-500)' : '2px solid var(--ink-200)',
                      background: editTags.includes(tag) ? 'var(--berry-50)' : 'var(--ink-50)',
                      color: editTags.includes(tag) ? 'var(--berry-700)' : 'var(--ink-600)',
                      fontSize: '0.85rem',
                      fontWeight: editTags.includes(tag) ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {editTags.includes(tag) ? '✓ ' : ''}{t('tag_' + tag)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button className="btn btn--primary btn--small" onClick={saveTags} disabled={savingTags}>
                  {savingTags ? t('account_saving') : t('account_save')}
                </button>
                <button className="btn btn--ghost btn--small" onClick={() => setEditingTags(false)}>
                  {t('account_cancel')}
                </button>
              </div>
            </div>
          )}
 
          {post.author?.walletAddress && isAuthenticated && !isOwner && (
            <div className="donate-section">
              <h3>{t('post_donate_title', { username: post.author.username })}</h3>
              <p>{t('post_donate_desc')}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <span className="wallet-badge">
                  🔗 {post.author.walletAddress.slice(0, 6)}...{post.author.walletAddress.slice(-4)}
                </span>
                <button className="btn btn--primary btn--small" disabled>{t('post_donate_soon')}</button>
              </div>
            </div>
          )}
 
          <div style={{ marginTop: 'var(--space-2xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--ink-100)' }}>
            <CommentSection postId={post._id} comments={comments} />
          </div>
        </div>
      </article>
    </div>
  );
}