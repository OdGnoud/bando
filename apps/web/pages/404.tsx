import React from 'react';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem', fontFamily: 'sans-serif', backgroundColor: '#FAF7F2', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#4A3728', margin: 0 }}>404</h1>
      <p style={{ color: '#706A61', marginTop: '1rem', fontSize: '1.125rem' }}>Không tìm thấy trang này.</p>
      <a
        href="/"
        style={{
          marginTop: '2rem',
          display: 'inline-block',
          backgroundColor: '#4A3728',
          color: '#ffffff',
          padding: '0.625rem 1.5rem',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        ← Về Trang Chủ
      </a>
    </div>
  );
}
