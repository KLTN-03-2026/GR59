import React from 'react';

// ─── Loading skeleton ──────────────────────────────────────────────────────────

export const LoadingRows: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <tbody>
    {Array.from({ length: count }).map((_, i) => (
      <tr key={i} style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
        {Array.from({ length: 5 }).map((_, j) => (
          <td key={j}>
            <div style={{
              height: '18px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
              backgroundSize: '200% 100%',
              animation: `shimmer 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              width: j === 0 ? '60%' : j === 4 ? '40%' : '80%',
            }} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

// ─── Error banner ──────────────────────────────────────────────────────────────

export const ErrorBanner: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #fef2f2, #fff5f5)',
    border: '1px solid #fecaca',
    borderRadius: '16px',
    marginBottom: '24px',
    gap: '16px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', flexShrink: 0,
      }}>⚠️</div>
      <div>
        <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#dc2626' }}>Lỗi kết nối</p>
        <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', fontWeight: 500, color: '#ef4444' }}>{message}</p>
      </div>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: '10px 20px', borderRadius: '10px', border: 'none',
          background: '#dc2626', color: 'white', fontSize: '0.875rem',
          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Thử lại
      </button>
    )}
  </div>
);

// ─── Skeleton cards (for stat cards area) ─────────────────────────────────────

export const SkeletonCards: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{
        background: 'white', borderRadius: '20px', padding: '28px',
        border: '1px solid #f1f5f9', minHeight: '110px',
      }}>
        <div style={{
          height: '12px', width: '50%', borderRadius: '6px',
          background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
          backgroundSize: '200% 100%',
          animation: `shimmer 1.4s ease-in-out ${i * 0.1}s infinite`,
          marginBottom: '12px',
        }} />
        <div style={{
          height: '28px', width: '40%', borderRadius: '8px',
          background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
          backgroundSize: '200% 100%',
          animation: `shimmer 1.4s ease-in-out ${i * 0.1}s infinite`,
        }} />
      </div>
    ))}
  </>
);
