import { useIsMobile } from '../hooks/useIsMobile';

export default function IkigaiViz({ answers }) {
  const isMobile = useIsMobile();

  const circles = [
    { label: 'Ce que tu AIMES', key: 'p5_intersection', color: '#C9A84C', x: 140, y: 90, r: 90 },
    { label: 'Ce en quoi tu es BON', key: 'p5_monetized_love', color: '#4A7C59', x: 210, y: 90, r: 90 },
    { label: 'Ce dont le monde a BESOIN', key: 'p2_world_problem', color: '#7C6FAC', x: 140, y: 160, r: 90 },
    { label: 'Ce pour quoi on te PAIE', key: 'p4_monetized', color: '#B85C38', x: 210, y: 160, r: 90 },
  ];

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: isMobile ? '16px' : '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 400, color: '#E8E6F0', marginBottom: '6px' }}>
          Ton Ikigai
        </h3>
        <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.45)' }}>
          L'intersection de ces 4 cercles révèle ta raison d'être professionnelle.
        </p>
      </div>

      {/* Responsive SVG container */}
      <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto 20px' }}>
        <svg
          viewBox="0 0 350 250"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {circles.map((c, i) => (
              <radialGradient key={i} id={`ikg_grad${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={c.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={c.color} stopOpacity="0.06" />
              </radialGradient>
            ))}
          </defs>

          {circles.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={`url(#ikg_grad${i})`} stroke={c.color} strokeWidth="1" strokeOpacity="0.4" />
          ))}

          {/* Center */}
          <circle cx="175" cy="125" r="28" fill="rgba(201,168,76,0.15)" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.6" />
          <text x="175" y="120" textAnchor="middle" fill="#C9A84C" fontSize="8" fontFamily="DM Sans, sans-serif">IKIGAI</text>
          <text x="175" y="133" textAnchor="middle" fill="rgba(201,168,76,0.7)" fontSize="7" fontFamily="DM Sans, sans-serif">ta vocation</text>

          {/* Labels */}
          <text x="100" y="58" textAnchor="middle" fill="#C9A84C" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">Ce que tu</text>
          <text x="100" y="70" textAnchor="middle" fill="#C9A84C" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">AIMES</text>
          <text x="250" y="58" textAnchor="middle" fill="#4A7C59" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">Ce en quoi</text>
          <text x="250" y="70" textAnchor="middle" fill="#4A7C59" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">tu es BON</text>
          <text x="100" y="198" textAnchor="middle" fill="#7C6FAC" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">Besoin du</text>
          <text x="100" y="210" textAnchor="middle" fill="#7C6FAC" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">MONDE</text>
          <text x="250" y="198" textAnchor="middle" fill="#B85C38" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">Ce pour quoi</text>
          <text x="250" y="210" textAnchor="middle" fill="#B85C38" fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.8">on te PAIE</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {circles.map((c, i) => {
          const hasAnswer = answers?.[c.key] && answers[c.key].length > 10;
          return (
            <div key={i} style={{ padding: '10px 12px', background: hasAnswer ? `${c.color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${hasAnswer ? `${c.color}30` : 'rgba(255,255,255,0.06)'}`, borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: c.color, fontWeight: 500, marginBottom: '4px' }}>{c.label}</div>
              <div style={{ fontSize: '11px', color: 'rgba(232,230,240,0.4)' }}>{hasAnswer ? '✓ Répondu' : 'À explorer'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
