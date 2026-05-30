import type { CSSProperties } from 'react';

const shell: CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 24,
  background:
    'radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 25%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
  color: '#0f172a'
};

const card: CSSProperties = {
  width: 'min(520px, 100%)',
  background: 'rgba(255, 255, 255, 0.82)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 24px 70px rgba(15, 23, 42, 0.12)',
  borderRadius: 24,
  padding: 28,
  backdropFilter: 'blur(18px)'
};

const spinner: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: '50%',
  border: '4px solid rgba(15, 118, 110, 0.16)',
  borderTopColor: '#0f766e',
  animation: 'phone-spin 0.85s linear infinite'
};

export function PageLoading({ title = '电话后台管理系统' }: { title?: string }) {
  return (
    <main style={shell}>
      <style>{`
        @keyframes phone-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <section style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={spinner} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: 'rgba(15, 23, 42, 0.62)' }}>正在准备页面内容，请稍候。</div>
          </div>
        </div>
      </section>
    </main>
  );
}
