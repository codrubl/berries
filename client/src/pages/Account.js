import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
export default function Account() {
  const { user, token, updateProfile, uploadAvatar, removeAvatar } = useAuth();
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const avatarInputRef = useRef(null);
 
  const fetchMyPosts = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/posts/user/${user._id}`);
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [user]);
 
  const fetchMyComments = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/comments/user/${user._id}`);
      const data = await res.json();
      if (res.ok) setComments(data.comments || []);
    } catch (err) { console.error(err); }
  }, [user]);
 
  useEffect(() => {
    fetchMyPosts();
    fetchMyComments();
  }, [fetchMyPosts, fetchMyComments]);
 
  const handleSave = async () => {
    setSaveLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({ bio, walletAddress, username });
      setEditing(false);
      setMessage({ type: 'success', text: t('account_updated') });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setSaveLoading(false);
  };
 
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Max 2MB' });
      return;
    }
    setAvatarLoading(true);
    try {
      await uploadAvatar(file);
      setMessage({ type: 'success', text: t('account_updated') });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setAvatarLoading(false);
  };
 
  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    try {
      await removeAvatar();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setAvatarLoading(false);
  };
 
  const handleDeletePost = (postId) => setPosts(posts.filter(p => p._id !== postId));
 
  const cancelEdit = () => {
    setEditing(false);
    setUsername(user.username || '');
    setBio(user.bio || '');
    setWalletAddress(user.walletAddress || '');
  };
 
  if (!user) return null;
 
  return (
    <div className="page-container">
      <div className="account-header">
        <div style={{ position: 'relative' }}>
          <Avatar username={user.username} avatarUrl={user.avatarUrl} size={100} className="account-avatar" />
          <input type="file" ref={avatarInputRef} accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarChange} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)', justifyContent: 'center' }}>
            <button className="btn btn--ghost btn--small" onClick={() => avatarInputRef.current?.click()}
              disabled={avatarLoading} style={{ fontSize: '0.75rem' }}>
              {avatarLoading ? '...' : t('account_profile_pic_change')}
            </button>
            {user.avatarUrl && (
              <button className="btn btn--ghost btn--small" onClick={handleRemoveAvatar}
                disabled={avatarLoading} style={{ fontSize: '0.75rem', color: 'var(--error)' }}>
                {t('account_profile_pic_remove')}
              </button>
            )}
          </div>
        </div>
        <div className="account-info">
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-400)', marginTop: 'var(--space-xs)' }}>
            {t('account_member_since')} {new Date(user.createdAt).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
          </p>
          {user.walletAddress && (
            <span className="wallet-badge">🔗 {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
          )}
        </div>
      </div>
 
      {message.text && <div className={`alert alert--${message.type}`}>{t(message.text)}</div>}
 
      {/* Edit Profile */}
      <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card__body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>{t('account_settings')}</h2>
            {!editing && (
              <button className="btn btn--secondary btn--small" onClick={() => setEditing(true)}>
                {t('account_edit')}
              </button>
            )}
          </div>
 
          {editing ? (
            <div>
              <div className="form-group">
                <label className="form-label">{t('account_username')}</label>
                <input type="text" className="form-input" value={username}
                  onChange={(e) => setUsername(e.target.value)} minLength={3} maxLength={30} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('account_bio')}</label>
                <textarea className="form-input form-textarea" value={bio}
                  onChange={(e) => setBio(e.target.value)} placeholder={t('account_bio_placeholder')} maxLength={300} rows={3} />
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--ink-400)', marginTop: 'var(--space-xs)' }}>
                  {bio.length} / 300
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('account_wallet')}</label>
                <input type="text" className="form-input" value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)} placeholder="0x..." />
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-400)', marginTop: 'var(--space-xs)' }}>
                  {t('account_wallet_hint')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button className="btn btn--primary btn--small" onClick={handleSave} disabled={saveLoading}>
                  {saveLoading ? t('account_saving') : t('account_save')}
                </button>
                <button className="btn btn--ghost btn--small" onClick={cancelEdit}>{t('account_cancel')}</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)' }}>{t('account_username')}:</span>
                <p style={{ marginTop: 'var(--space-xs)' }}>{user.username}</p>
              </div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)' }}>{t('account_bio')}:</span>
                <p style={{ marginTop: 'var(--space-xs)', color: user.bio ? 'var(--ink-800)' : 'var(--ink-400)' }}>
                  {user.bio || t('account_no_bio')}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)' }}>{t('account_wallet')}:</span>
                <p style={{ marginTop: 'var(--space-xs)', color: user.walletAddress ? 'var(--ink-800)' : 'var(--ink-400)', fontFamily: user.walletAddress ? 'monospace' : 'inherit', fontSize: '0.9rem' }}>
                  {user.walletAddress || t('account_no_wallet')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
 
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid var(--ink-100)', paddingBottom: 'var(--space-sm)' }}>
        <button
          className={`btn btn--ghost ${activeTab === 'posts' ? '' : ''}`}
          onClick={() => setActiveTab('posts')}
          style={{
            fontWeight: activeTab === 'posts' ? 600 : 400,
            color: activeTab === 'posts' ? 'var(--berry-700)' : 'var(--ink-500)',
            borderBottom: activeTab === 'posts' ? '2px solid var(--berry-600)' : 'none',
            borderRadius: 0,
            paddingBottom: 'var(--space-sm)'
          }}
        >
          {t('account_my_posts')} ({posts.length})
        </button>
        <button
          className={`btn btn--ghost`}
          onClick={() => setActiveTab('comments')}
          style={{
            fontWeight: activeTab === 'comments' ? 600 : 400,
            color: activeTab === 'comments' ? 'var(--berry-700)' : 'var(--ink-500)',
            borderBottom: activeTab === 'comments' ? '2px solid var(--berry-600)' : 'none',
            borderRadius: 0,
            paddingBottom: 'var(--space-sm)'
          }}
        >
          {t('account_my_comments')} ({comments.length})
        </button>
      </div>
 
      {activeTab === 'posts' && (
        loading ? (
          <div className="loading-spinner"><div className="loading-spinner__circle" /></div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <p>{t('account_no_posts')}</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onDelete={handleDeletePost} />)
        )
      )}
 
      {activeTab === 'comments' && (
        comments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">💬</div>
            <p>{t('account_no_comments')}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="card" style={{ marginBottom: 'var(--space-md)' }}>
              <div className="card__body" style={{ padding: 'var(--space-md)' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--ink-800)', marginBottom: 'var(--space-sm)' }}>
                  "{comment.content}"
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink-400)' }}>
                  {comment.post ? (
                    <>
                      {t('user_on_post')}{' '}
                      <Link to={`/post/${comment.post._id}`} style={{ color: 'var(--berry-600)' }}>
                        {comment.post.content?.substring(0, 60)}{comment.post.content?.length > 60 ? '...' : ''}
                      </Link>
                    </>
                  ) : (
                    <span style={{ fontStyle: 'italic' }}>Post deleted</span>
                  )}
                  {' · '}
                  {new Date(comment.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}