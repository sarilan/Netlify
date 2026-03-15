import { useState } from 'react';
import { ARCHETYPES } from '../phases';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Archetypes({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const isMobile = useIsMobile();

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: isMobile ? '16px' : '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#E8E6F0', marginBottom: '6px' }}>
          Les 4 Archétypes
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.45)' }}>
          Quel archétype résonne le plus avec ta façon d'être au travail ?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
        {ARCHETYPES.map(arch => {
          const isSelected = selected === arch.id;
          const isHovered = hovered === arch.id;
          return (
            <button
              key={arch.id}
              onClick={() => onSelect(arch.id)}
              onMouseEnter={() => setHovered(arch.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isSelected ? `${arch.color}15` : isHovered ? `${arch.color}08` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? `${arch.color}50` : isHovered ? `${arch.color}25` : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '10px',
                padding: isMobile ? '14px' : '18px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                display: isMobile ? 'flex' : 'block',
                alignItems: isMobile ? 'flex-start' : undefined,
                gap: isMobile ? '14px' : undefined,
              }}
            >
              <span style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${arch.color}20`, borderRadius: '10px', fontSize: '20px', color: arch.color }}>
                {arch.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: arch.color, marginBottom: '6px' }}>{arch.name}</div>
                <p style={{ fontSize: '12px', color: 'rgba(232,230,240,0.6)', lineHeight: 1.5, marginBottom: '10px' }}>
                  {arch.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {arch.vocations.map(v => (
                    <span key={v} style={{ fontSize: '10px', padding: '2px 8px', background: `${arch.color}10`, border: `1px solid ${arch.color}25`, borderRadius: '100px', color: arch.color }}>{v}</span>
                  ))}
                </div>
                {isSelected && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${arch.color}20`, fontSize: '11px', color: arch.color, letterSpacing: '0.05em' }}>
                    ✓ Archétype sélectionné
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
