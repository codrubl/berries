import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
 
const API_BASE = process.env.REACT_APP_API_URL || '';
 
const AVAILABLE_TAGS = [
  'sport', 'gaming', 'art', 'movies', 'memes',
  'technology', 'politics', 'music', 'food',
  'travel', 'science', 'education'
];
 
export default function CreatePost() {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError(t('create_image_too_big')); return; }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };
 
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) { setError(t('create_empty')); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (selectedTags.length > 0) formData.append('tags', JSON.stringify(selectedTags));
      if (image) formData.append('image', image);
 
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate('/feed');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
 
  return (
    <div className="create-post-page">
      <h1>{t('create_title')}</h1>
      {error && <div className="alert alert--error">{t(error)}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="content">{t('create_what')}</label>
          <textarea id="content" className="form-input form-textarea" placeholder={t('create_placeholder')}
            value={content} onChange={(e) => setContent(e.target.value)} maxLength={5000} rows={6} style={{ minHeight: '160px' }} />
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--ink-400)', marginTop: 'var(--space-xs)' }}>
            {content.length} / 5000
          </div>
        </div>
 
        <div className="form-group">
          <label className="form-label">{t('create_tags')}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTags(prev =>
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                )}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  border: selectedTags.includes(tag) ? '2px solid var(--berry-500)' : '2px solid var(--ink-200)',
                  background: selectedTags.includes(tag) ? 'var(--berry-50)' : 'var(--ink-50)',
                  color: selectedTags.includes(tag) ? 'var(--berry-700)' : 'var(--ink-600)',
                  fontSize: '0.85rem',
                  fontWeight: selectedTags.includes(tag) ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {selectedTags.includes(tag) ? '✓ ' : ''}{t('tag_' + tag)}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-400)', marginTop: 'var(--space-xs)' }}>
            {t('create_tags_hint')}
          </p>
        </div>
 
        <div className="form-group">
          <label className="form-label">{t('create_image')}</label>
          <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange} style={{ display: 'none' }} />
          {imagePreview ? (
            <div style={{ position: 'relative' }}>
              <img src={imagePreview} alt="Preview" className="image-preview" style={{ width: '100%' }} />
              <button type="button" onClick={removeImage} className="btn btn--danger btn--small"
                style={{ position: 'absolute', top: '8px', right: '8px' }}>
                {t('create_image_remove')}
              </button>
            </div>
          ) : (
            <div className="image-upload" onClick={() => fileInputRef.current?.click()}>
              {t('create_image_click')}<br />
              <span style={{ fontSize: '0.8rem' }}>{t('create_image_hint')}</span>
            </div>
          )}
        </div>
 
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button type="submit" className="btn btn--primary" disabled={loading || !content.trim()}>
            {loading ? t('create_publishing') : t('create_publish')}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/feed')}>
            {t('create_cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}