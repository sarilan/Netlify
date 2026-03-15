import { useState } from 'react';

const s = {
  root: {
    minHeight: '100vh',
    background: '#0A0A0F',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(184,92,56,0.08) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: '100px',
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#C9A84C',
    marginBottom: '32px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(64px, 12vw, 120px)',
    fontWeight: 300,
    letterSpacing: '-0.02em',
    color: '#E8E6F0',
    lineHeight: 0.9,
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(14px, 2vw, 18px)',
    fontWeight: 300,
    color: 'rgba(232,230,240,0.5)',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    marginBottom: '48px',
    textAlign: 'center',
  },
  desc: {
    maxWidth: '480px',
    textAlign: 'center',
    color: 'rgba(232,230,240,0.6)',
    fontSize: '15px',
    lineHeight: 1.7,
    marginBottom: '56px',
  },
  phases: {
    display: 'flex',
    gap: '8px',
    marginBottom: '56px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  phaseTag: {
    padding: '4px 12px',
    borderRadius: '100px',
    fontSize: '11px',
    letterSpacing: '0.06em',
    border: '1px solid',
  },
  cta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  btn: {
    padding: '16px 48px',
    background: 'linear-gradient(135deg, #C9A84C, #B8923A)',
    color: '#0A0A0F',
    borderRadius: '100px',
    fontSize: '15px',
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    border: 'none',
    letterSpacing: '0.02em',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 40px rgba(201,168,76,0.25)',
  },
  legal: {
    fontSize: '12px',
    color: 'rgba(232,230,240,0.3)',
    textAlign: 'center',
  },
};

const PHASE_TAGS = [
  { label: '01 Fondation', color: '#C9A84C' },
  { label: '02 Passion', color: '#B85C38' },
  { label: '03 Compétences', color: '#4A7C59' },
  { label: '04 Marché', color: '#7C6FAC' },
  { label: '05 Ikigai', color: '#C9A84C' },
  { label: '06 Exécution', color: '#B85C38' },
];

export default function Landing({ onStart }) {
  const [hover, setHover] = useState(false);

  return (
    <div style={s.root}>
      <div style={s.bg} />
      <div style={s.badge}>
        <span>✦</span>
        <span>Découverte de vocation guidée par l'IA</span>
      </div>
      <h1 style={s.title}>FORGE</h1>
      <p style={s.subtitle}>Découvre qui tu es vraiment</p>
      <p style={s.desc}>
        Un voyage structuré en 6 phases psychologiques pour identifier ta vocation professionnelle profonde.
        Guidé par ARIA, ton coach IA, tu exploreras ton identité, tes passions, et la façon dont elles se transforment en valeur réelle.
      </p>
      <div style={s.phases}>
        {PHASE_TAGS.map(p => (
          <span key={p.label} style={{
            ...s.phaseTag,
            color: p.color,
            borderColor: `${p.color}40`,
            background: `${p.color}10`,
          }}>
            {p.label}
          </span>
        ))}
      </div>
      <div style={s.cta}>
        <button
          style={{
            ...s.btn,
            transform: hover ? 'scale(1.03)' : 'scale(1)',
            boxShadow: hover ? '0 0 60px rgba(201,168,76,0.4)' : '0 0 40px rgba(201,168,76,0.25)',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={onStart}
        >
          Commencer le voyage
        </button>
        <p style={s.legal}>Aucun compte requis · 100% local · Gratuit</p>
      </div>
    </div>
  );
}
