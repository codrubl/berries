import React from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function Avatar({ username, avatarUrl, size = 44, className = 'post-card__avatar' }) {
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  if (avatarUrl) {
    return (
      <img
        src={`${API_BASE}${avatarUrl}`}
        alt={username}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0
        }}
      />
    );
  }

  return (
    <div className={className} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initial}
    </div>
  );
}