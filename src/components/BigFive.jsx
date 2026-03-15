import { OCEAN_DIMENSIONS } from '../phases';

export default function BigFive({ scores, onChange }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '24px',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '20px',
          fontWeight: 400,
          color: '#E8E6F0',
          marginBottom: '6px',
        }}>Big Five OCEAN</h3>
        <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.45)' }}>
          Évalue-toi honnêtement sur chaque dimension. 1 = très faible, 5 = très élevé.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {OCEAN_DIMENSIONS.map(dim => {
          const score = scores?.[dim.id] || 0;
          return (
            <div key={dim.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#E8E6F0',
                    letterSpacing: '0.05em',
                  }}>
                    {dim.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(232,230,240,0.35)', marginLeft: '8px' }}>
                    {score > 0 ? (score <= 2 ? dim.low : score >= 4 ? dim.high : 'Équilibré') : ''}
                  </span>
                </div>
                <span style={{
                  fontSize: '13px',
                  color: score > 0 ? dim.color : 'rgba(232,230,240,0.3)',
                  fontWeight: 500,
                }}>
                  {score > 0 ? score + '/5' : '—'}
                </span>
              </div>

              {/* Score bar */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => onChange(dim.id, v)}
                    style={{
                      flex: 1,
                      height: '32px',
                      borderRadius: '6px',
                      border: `1px solid ${v <= score ? dim.color + '80' : 'rgba(255,255,255,0.08)'}`,
                      background: v <= score
                        ? `${dim.color}${v === score ? '40' : '20'}`
                        : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontSize: '12px',
                      color: v <= score ? dim.color : 'rgba(232,230,240,0.25)',
                      fontWeight: v === score ? 600 : 400,
                    }}
                    onMouseEnter={e => {
                      if (v > score) {
                        e.currentTarget.style.background = `${dim.color}15`;
                        e.currentTarget.style.borderColor = `${dim.color}40`;
                      }
                    }}
                    onMouseLeave={e => {
                      if (v > score) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: 'rgba(232,230,240,0.25)' }}>{dim.low.split(',')[0]}</span>
                <span style={{ fontSize: '10px', color: 'rgba(232,230,240,0.25)' }}>{dim.high.split(',')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
