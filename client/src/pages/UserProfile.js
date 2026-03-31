import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function UserProfile() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, postsRes, commentsRes] = await Promise.all([
          fetch(`${API_BASE}/api/auth/user/${id}`),
          fetch(`${API_BASE}/api/posts/user/${id}`),
          fetch(`${API_BASE}/api/comments/user/${id}`)
        ]);

        const userData = await userRes.json();
        const postsData = await postsRes.json();
        const commentsData = await commentsRes.json();

        if (!userRes.ok) throw new Error(userData.message);

        setProfileUser(userData.user);
        setPosts(postsData.posts || []);
        setComments(commentsData.comments || []);
      } catch (err) { setError(err.message); }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  const handleDelete = (postId) => setPosts(posts.filter(p => p._id !== postId));

  if (loading) return <div className="page-container"><div className="loading-spinner"><div className="loading-spinner__circle" /></div></div>;

  if (error || !profileUser) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state__icon">😔</div>
          <p>{error || t('user_not_found')}</p>
          <Link to="/feed" className="btn btn--secondary" style={{ marginTop: 'var(--space-lg)' }}>{t('post_back')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/feed" className="btn btn--ghost" style={{ marginBottom: 'var(--space-lg)' }}>{t('post_back')}</Link>

      <div className="account-header">
        <Avatar username={profileUser.username} avatarUrl={profileUser.avatarUrl} size={100} className="account-avatar" />
        <div className="account-info">
          <h1>{profileUser.username}</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-400)', marginTop: 'var(--space-xs)' }}>
            {t('account_member_since')} {new Date(profileUser.createdAt).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
          </p>
          {profileUser.walletAddress && (
            <span className="wallet-badge">🔗 {profileUser.walletAddress.slice(0, 6)}...{profileUser.walletAddress.slice(-4)}</span>
          )}
        </div>
      </div>

      {(profileUser.bio || profileUser.walletAddress) && (
        <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="card__body">
            {profileUser.bio && (
              <div style={{ marginBottom: profileUser.walletAddress ? 'var(--space-md)' : 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)' }}>{t('account_bio')}:</span>
                <p style={{ marginTop: 'var(--space-xs)', color: 'var(--ink-800)', lineHeight: 1.6 }}>
                  {profileUser.bio}
                </p>
              </div>
            )}
            {profileUser.walletAddress && (
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)' }}>{t('account_wallet')}:</span>
                <p style={{ marginTop: 'var(--space-xs)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--ink-800)' }}>
                  {profileUser.walletAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', borderBottom: '2px solid var(--ink-100)', paddingBottom: 'var(--space-sm)' }}>
        <button
          className="btn btn--ghost"
          onClick={() => setActiveTab('posts')}
          style={{
            fontWeight: activeTab === 'posts' ? 600 : 400,
            color: activeTab === 'posts' ? 'var(--berry-700)' : 'var(--ink-500)',
            borderBottom: activeTab === 'posts' ? '2px solid var(--berry-600)' : 'none',
            borderRadius: 0, paddingBottom: 'var(--space-sm)'
          }}
        >
          {t('user_posts')} ({posts.length})
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => setActiveTab('comments')}
          style={{
            fontWeight: activeTab === 'comments' ? 600 : 400,
            color: activeTab === 'comments' ? 'var(--berry-700)' : 'var(--ink-500)',
            borderBottom: activeTab === 'comments' ? '2px solid var(--berry-600)' : 'none',
            borderRadius: 0, paddingBottom: 'var(--space-sm)'
          }}
        >
          {t('user_comments')} ({comments.length})
        </button>
      </div>

      {activeTab === 'posts' && (
        posts.length === 0 ? (
          <div className="empty-state"><p>{t('user_no_posts')}</p></div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onDelete={handleDelete} />)
        )
      )}

      {activeTab === 'comments' && (
        comments.length === 0 ? (
          <div className="empty-state"><p>{t('user_no_comments')}</p></div>
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