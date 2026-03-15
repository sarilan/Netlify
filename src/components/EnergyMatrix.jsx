import { useState } from 'react';

const QUADRANTS = [
  {
    id: 'genius',
    label: 'Zone de Génie',
    icon: '⬡',
    energy: 'Haute énergie',
    skill: 'Haute compétence',
    desc: 'Ce qui te rend unique. Tu excelles ET tu aimes. C\'est ici que réside ta vocation.',
    color: '#4A7C59',
    bg: 'rgba(74,124,89,0.12)',
    border: 'rgba(74,124,89,0.3)',
    position: { top: 0, left: 0 },
  },
  {
    id: 'growth',
    label: 'Zone de Croissance',
    icon: '↑',
    energy: 'Haute énergie',
    skill: 'Faible compétence',
    desc: 'Tu adores mais tu démarres. Investis ici — le talent viendra avec la pratique.',
    color: '#C9A84C',
    bg: 'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.3)',
    position: { top: 0, right: 0 },
  },
  {
    id: 'empty',
    label: 'Compétence Vide',
    icon: '□',
    energy: 'Faible énergie',
    skill: 'Haute compétence',
    desc: 'Tu es bon mais ça t\'ennuie. Délègue ou automatise. Ne construis pas de carrière ici.',
    color: 'rgba(232,230,240,0.35)',
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.1)',
    position: { bottom: 0, left: 0 },
  },
  {
    id: 'escape',
    label: 'Zone de Fuite',
    icon: '✕',
    energy: 'Faible énergie',
    skill: 'Faible compétence',
    desc: 'Ni énergie ni talent. Évite absolument ou transforme l\'environnement.',
    color: '#B85C38',
    bg: 'rgba(184,92,56,0.08)',
    border: 'rgba(184,92,56,0.2)',
    position: { bottom: 0, right: 0 },
  },
];

export default function EnergyMatrix({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null);

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
        }}>Matrice Énergie × Compétence</h3>
        <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.45)' }}>
          Identifie dans quel quadrant se situent tes principales activités.
        </p>
      </div>

      {/* Axis labels */}
      <div style={{ position: 'relative' }}>
        {/* Y-axis label */}
        <div style={{
          position: 'absolute',
          left: '-4px',
          top: '50%',
          transform: 'translateX(-100%) translateY(-50%) rotate(-90deg)',
          fontSize: '10px',
          color: 'rgba(232,230,240,0.3)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Énergie →</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          {QUADRANTS.map(q => {
            const isSelected = selected === q.id;
            const isHovered = hovered === q.id;
            return (
              <button
                key={q.id}
                onClick={() => onSelect(q.id)}
                onMouseEnter={() => setHovered(q.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isSelected ? q.bg : isHovered ? q.bg : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? q.border : isHovered ? q.border : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '10px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: q.color,
                  }} />
                )}
                <div style={{ fontSize: '20px', marginBottom: '6px', color: q.color }}>{q.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: q.color, marginBottom: '4px' }}>
                  {q.label}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(232,230,240,0.35)', marginBottom: '8px' }}>
                  {q.energy} · {q.skill}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(232,230,240,0.6)', lineHeight: 1.5 }}>
                  {q.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* X-axis label */}
        <div style={{
          textAlign: 'center',
          marginTop: '8px',
          fontSize: '10px',
          color: 'rgba(232,230,240,0.3)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>← Compétence →</div>
      </div>

      {selected && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'rgba(232,230,240,0.6)',
        }}>
          Zone sélectionnée : <span style={{ color: QUADRANTS.find(q => q.id === selected)?.color, fontWeight: 500 }}>
            {QUADRANTS.find(q => q.id === selected)?.label}
          </span>
        </div>
      )}
    </div>
  );
}
