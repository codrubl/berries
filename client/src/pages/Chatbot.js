import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
 
const AVAILABLE_TAGS = [
  'sport', 'gaming', 'art', 'movies', 'memes',
  'technology', 'politics', 'music', 'food',
  'travel', 'science', 'education'
];
 
const KEYWORD_MAP = {
  sport: ['sport', 'sports', 'football', 'soccer', 'basketball', 'tennis', 'fitness', 'gym', 'fotbal', 'baschet', 'tenis', 'atletism', 'antrenament', 'sala'],
  gaming: ['gaming', 'games', 'game', 'video games', 'jocuri', 'joc', 'playstation', 'xbox', 'nintendo', 'pc gaming', 'esports', 'pc', 'calculator'],
  art: ['art', 'arta', 'painting', 'drawing', 'pictura', 'desen', 'design'],
  movies: ['movies', 'movie', 'film', 'filme', 'cinema', 'series', 'serial', 'seriale', 'tv', 'netflix', 'anime'],
  memes: ['memes', 'meme', 'funny', 'humor', 'umor', 'amuzant', 'comedy', 'comedie'],
  technology: ['technology', 'tech', 'tehnologie', 'programming', 'programare', 'coding', 'software', 'ai', 'crypto', 'blockchain', 'it'],
  politics: ['politics', 'politica', 'political', 'politic', 'government', 'guvern', 'elections', 'alegeri'],
  music: ['music', 'muzica', 'songs', 'melodii', 'concert', 'concerte', 'guitar', 'chitara', 'piano', 'rap', 'rock', 'pop'],
  food: ['food', 'mancare', 'cooking', 'gatit', 'recipe', 'reteta', 'retete', 'restaurant', 'restaurante', 'bucatarie'],
  travel: ['travel', 'calatorii', 'calatorie', 'trip', 'excursie', 'vacation', 'vacanta', 'tour', 'tur',],
  science: ['science', 'stiinta', 'physics', 'fizica', 'chemistry', 'chimie', 'biology', 'biologie', 'space', 'spatiu', 'research'],
  education: ['education', 'educatie', 'learning', 'invatare', 'school', 'scoala', 'university', 'universitate', 'study', 'studiu', 'curs']
};
 
function parseInterestsFromText(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const [tag, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(kw => lower.includes(kw))) {
      if (!found.includes(tag)) found.push(tag);
    }
  }
  return found;
}
 
export default function Chatbot() {
  const { user, updateInterests } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const messagesEndRef = useRef(null);
 
  useEffect(() => {
    const initial = [
      { from: 'bot', text: t('chatbot_greeting') },
    ];
    if (user?.interests?.length > 0) {
      initial.push({
        from: 'bot',
        text: t('chatbot_current_interests', { interests: user.interests.map(i => t('tag_' + i)).join(', ') })
      });
    }
    initial.push({ from: 'bot', text: t('chatbot_ask') });
    setMessages(initial);
  }, [t, user?.interests]);
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
 
  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { from: 'bot', text }]);
  };
 
  const toggleInterest = (tag) => {
    setSelectedInterests(prev => {
      const next = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      return next;
    });
    setSaved(false);
  };
 
  const handleSend = () => {
    if (!input.trim()) return;
 
    const userText = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userText }]);
    setInput('');
 
    const found = parseInterestsFromText(userText);
 
    if (found.length > 0) {
      setSelectedInterests(prev => {
        const combined = [...new Set([...prev, ...found])];
        return combined;
      });
      setSaved(false);
 
      const foundNames = found.map(f => t('tag_' + f)).join(', ');
      setTimeout(() => {
        addBotMessage(t('chatbot_found_interests', { interests: foundNames }));
        addBotMessage(t('chatbot_anything_else'));
      }, 400);
    } else {
      setTimeout(() => {
        addBotMessage(t('chatbot_not_understood'));
      }, 400);
    }
  };
 
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateInterests(selectedInterests);
      setSaved(true);
      addBotMessage(
        selectedInterests.length > 0
          ? t('chatbot_saved', { interests: selectedInterests.map(i => t('tag_' + i)).join(', ') })
          : t('chatbot_saved_empty')
      );
    } catch (err) {
      addBotMessage(t(err.message));
    }
    setSaving(false);
  };
 
  const handleClear = () => {
    setSelectedInterests([]);
    setSaved(false);
  };
 
  return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      <h1 style={{ marginBottom: 'var(--space-sm)' }}>{t('chatbot_title')}</h1>
      <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
        {t('chatbot_description')}
      </p>
 
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--ink-100)',
        padding: 'var(--space-lg)',
        minHeight: 300,
        maxHeight: 400,
        overflowY: 'auto',
        marginBottom: 'var(--space-lg)'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 'var(--space-sm)'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '0.6rem 1rem',
              borderRadius: msg.from === 'user'
                ? 'var(--radius-md) var(--radius-md) 4px var(--radius-md)'
                : 'var(--radius-md) var(--radius-md) var(--radius-md) 4px',
              background: msg.from === 'user' ? 'var(--berry-600)' : 'var(--ink-50)',
              color: msg.from === 'user' ? 'white' : 'var(--ink-800)',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
 
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink-600)', marginBottom: 'var(--space-sm)' }}>
          {t('chatbot_select_tags')}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {AVAILABLE_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleInterest(tag)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: selectedInterests.includes(tag) ? '2px solid var(--berry-500)' : '2px solid var(--ink-200)',
                background: selectedInterests.includes(tag) ? 'var(--berry-50)' : 'white',
                color: selectedInterests.includes(tag) ? 'var(--berry-700)' : 'var(--ink-600)',
                fontSize: '0.85rem',
                fontWeight: selectedInterests.includes(tag) ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {selectedInterests.includes(tag) ? '✓ ' : ''}{t('tag_' + tag)}
            </button>
          ))}
        </div>
      </div>
 
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <input
          type="text"
          className="form-input"
          placeholder={t('chatbot_input_placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
        />
        <button className="btn btn--primary btn--small" onClick={handleSend} disabled={!input.trim()}>
          {t('comments_send')}
        </button>
      </div>
 
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? t('account_saving') : t('chatbot_save_interests')}
        </button>
        <button className="btn btn--ghost" onClick={handleClear}>
          {t('chatbot_clear')}
        </button>
        {saved && (
          <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 500 }}>
            ✓ {t('chatbot_saved_confirmation')}
          </span>
        )}
      </div>
 
      {user?.interests?.length > 0 && (
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          background: 'var(--berry-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--berry-100)'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--berry-700)' }}>
            {t('chatbot_active_interests')}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-700)', marginLeft: 'var(--space-sm)' }}>
            {user.interests.map(i => t('tag_' + i)).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}