import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

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
  },
];

export default function EnergyMatrix({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const isMobile = useIsMobile();

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: isMobile ? '16px' : '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#E8E6F0', marginBottom: '6px' }}>
          Matrice Énergie × Compétence
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.45)' }}>
          Identifie dans quel quadrant se situent tes principales activités.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
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
                padding: isMobile ? '14px' : '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                display: isMobile ? 'flex' : 'block',
                alignItems: isMobile ? 'flex-start' : undefined,
                gap: isMobile ? '12px' : undefined,
              }}
            >
              {isSelected && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', borderRadius: '50%', background: q.color }} />
              )}
              <div style={{ fontSize: isMobile ? '22px' : '20px', marginBottom: isMobile ? 0 : '6px', color: q.color, flexShrink: 0 }}>{q.icon}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: q.color, marginBottom: '4px' }}>{q.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(232,230,240,0.35)', marginBottom: '6px' }}>{q.energy} · {q.skill}</div>
                <p style={{ fontSize: '12px', color: 'rgba(232,230,240,0.6)', lineHeight: 1.5 }}>{q.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '13px', color: 'rgba(232,230,240,0.6)' }}>
          Zone sélectionnée : <span style={{ color: QUADRANTS.find(q => q.id === selected)?.color, fontWeight: 500 }}>
            {QUADRANTS.find(q => q.id === selected)?.label}
          </span>
        </div>
      )}
    </div>
  );
}
