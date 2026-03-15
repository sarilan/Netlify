import { useState, useCallback, useEffect, useRef } from 'react';
import { PHASES } from '../phases';
import { useStorage } from '../hooks/useStorage';
import { useIsMobile } from '../hooks/useIsMobile';
import QuestionCard from './QuestionCard';
import BigFive from './BigFive';
import EnergyMatrix from './EnergyMatrix';
import Archetypes from './Archetypes';
import IkigaiViz from './IkigaiViz';
import Coach from './Coach';
import Synthesis from './Synthesis';

const XP_ANIM_DURATION = 2200;
const BOTTOM_NAV_H = 60;

function calcTotalXP(completedPhases) {
  return PHASES.filter(p => completedPhases.includes(p.id)).reduce((sum, p) => sum + p.xpReward, 0);
}

function phaseProgress(phase, answers) {
  const total = phase.questions.length;
  const answered = phase.questions.filter(q => answers[q.id] && answers[q.id].length > 10).length;
  return { answered, total, pct: total > 0 ? answered / total : 0 };
}

function isPhaseComplete(phase, answers) {
  return phaseProgress(phase, answers).pct >= 0.6;
}

// ─── Mobile Phase Strip ────────────────────────────────────────
function PhaseStrip({ phases, activePhaseId, completedPhases, answers, onSelect, isPhaseAccessible }) {
  const stripRef = useRef(null);

  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-phaseid="${activePhaseId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activePhaseId]);

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,10,15,0.95)',
      flexShrink: 0,
    }}>
      <div
        ref={stripRef}
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '10px 16px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {phases.map(phase => {
          const isActive = activePhaseId === phase.id;
          const isComplete = completedPhases.includes(phase.id);
          const accessible = isPhaseAccessible(phase.id);
          return (
            <button
              key={phase.id}
              data-phaseid={phase.id}
              onClick={() => accessible && onSelect(phase.id)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#0A0A0F' : accessible ? phase.color : 'rgba(232,230,240,0.25)',
                background: isActive
                  ? phase.color
                  : accessible
                    ? `${phase.color}15`
                    : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? phase.color : accessible ? `${phase.color}40` : 'rgba(255,255,255,0.07)'}`,
                cursor: accessible ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.06em' }}>
                {phase.number}
              </span>
              {isComplete && <span style={{ fontSize: '10px' }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────
function BottomNav({ activeTab, onChange }) {
  const tabs = [
    { id: 'journey', label: 'Voyage', icon: '◈' },
    { id: 'coach', label: 'ARIA', icon: '✦' },
    { id: 'synthesis', label: 'Synthèse', icon: '◉' },
  ];
  return (
    <div style={{
      height: `${BOTTOM_NAV_H}px`,
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(10,10,15,0.97)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexShrink: 0,
      zIndex: 20,
    }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#C9A84C' : 'rgba(232,230,240,0.35)',
              transition: 'color 0.15s ease',
            }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{tab.icon}</span>
            <span style={{
              fontSize: '10px',
              letterSpacing: '0.05em',
              fontWeight: isActive ? 600 : 400,
            }}>{tab.label}</span>
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '32px',
                height: '2px',
                background: '#C9A84C',
                borderRadius: '2px 2px 0 0',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Desktop Sidebar ───────────────────────────────────────────
function Sidebar({ phases, activePhaseId, completedPhases, answers, onSelect, isPhaseAccessible, totalXP, level, levelXP }) {
  return (
    <div style={{
      width: '220px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      overflowY: 'auto',
      padding: '16px 12px',
      flexShrink: 0,
      background: 'rgba(255,255,255,0.01)',
      animation: 'slideIn 0.2s ease forwards',
    }}>
      {phases.map(phase => {
        const prog = phaseProgress(phase, answers);
        const isActive = activePhaseId === phase.id;
        const isComplete = completedPhases.includes(phase.id);
        const accessible = isPhaseAccessible(phase.id);

        return (
          <button
            key={phase.id}
            onClick={() => accessible && onSelect(phase.id)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'left',
              background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: `1px solid ${isActive ? phase.color + '40' : 'transparent'}`,
              cursor: accessible ? 'pointer' : 'not-allowed',
              opacity: accessible ? 1 : 0.35,
              marginBottom: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { if (accessible && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '11px', color: phase.color, letterSpacing: '0.08em' }}>
                {phase.number}
              </span>
              {isComplete && <span style={{ marginLeft: 'auto', fontSize: '10px', color: phase.color }}>✓</span>}
            </div>
            <div style={{ fontSize: '12px', color: isActive ? '#E8E6F0' : 'rgba(232,230,240,0.6)', fontWeight: isActive ? 500 : 400, marginBottom: '6px', lineHeight: 1.3 }}>
              {phase.title}
            </div>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${prog.pct * 100}%`, background: phase.color, opacity: 0.7, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(232,230,240,0.3)', marginTop: '4px' }}>
              {prog.answered}/{prog.total} questions
            </div>
          </button>
        );
      })}

      <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px' }}>
        <div style={{ fontSize: '10px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em', marginBottom: '8px' }}>PROGRESSION XP</div>
        <div style={{ fontSize: '18px', color: '#C9A84C', fontFamily: "'Cormorant Garamond', serif", marginBottom: '4px' }}>{totalXP} XP</div>
        <div style={{ height: '3px', background: 'rgba(201,168,76,0.15)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
          <div style={{ height: '100%', width: `${(levelXP / 300) * 100}%`, background: '#C9A84C', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(232,230,240,0.3)' }}>Niv. {level} · {levelXP}/300 vers niv. {level + 1}</div>
      </div>
    </div>
  );
}

// ─── Main Journey Component ────────────────────────────────────
export default function Journey() {
  const { data, set, setNested } = useStorage();
  const isMobile = useIsMobile();
  const [activePhaseId, setActivePhaseId] = useState(1);
  const [activeTab, setActiveTab] = useState('journey');
  const [xpAnim, setXpAnim] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const answers = data.answers || {};
  const bigFive = data.bigfive || {};
  const completedPhases = data.completedPhases || [];
  const energyMatrix = data.energyMatrix || null;
  const archetype = data.archetype || null;

  const totalXP = calcTotalXP(completedPhases);
  const level = Math.floor(totalXP / 300) + 1;
  const levelXP = totalXP % 300;

  const handleAnswer = useCallback((qId, value) => setNested('answers', qId, value), [setNested]);
  const handleBigFive = useCallback((dimId, score) => setNested('bigfive', dimId, score), [setNested]);
  const handleEnergyMatrix = useCallback((id) => set('energyMatrix', id), [set]);
  const handleArchetype = useCallback((id) => set('archetype', id), [set]);

  useEffect(() => {
    const activePhase = PHASES.find(p => p.id === activePhaseId);
    if (!activePhase) return;
    const complete = isPhaseComplete(activePhase, data.answers || {});
    const wasComplete = completedPhases.includes(activePhaseId);
    if (complete && !wasComplete) {
      const newCompleted = [...completedPhases, activePhaseId];
      set('completedPhases', newCompleted);
      setXpAnim({ amount: activePhase.xpReward, phaseId: activePhaseId });
      setTimeout(() => setXpAnim(null), XP_ANIM_DURATION);
    }
  }, [data.answers, activePhaseId, completedPhases, set]);

  const activePhase = PHASES.find(p => p.id === activePhaseId);
  const globalProgress = PHASES.reduce((sum, p) => sum + phaseProgress(p, answers).pct, 0) / PHASES.length;
  const isPhaseAccessible = (id) => id === 1 || completedPhases.includes(id - 1);

  // ── Shared Phase Content ──────────────────────────────────────
  const phaseContent = activePhase && (
    <div style={{ maxWidth: '720px', margin: '0 auto', animation: 'fadeIn 0.3s ease forwards' }}>
      {/* Phase header */}
      <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: activePhase.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Phase {activePhase.number}
          </span>
          <span style={{ fontSize: '11px', color: activePhase.color, padding: '2px 8px', background: `${activePhase.color}15`, border: `1px solid ${activePhase.color}30`, borderRadius: '100px' }}>
            {activePhase.subtitle}
          </span>
          {completedPhases.includes(activePhase.id) && (
            <span style={{ fontSize: '11px', color: '#4A7C59', padding: '2px 8px', background: 'rgba(74,124,89,0.12)', border: '1px solid rgba(74,124,89,0.3)', borderRadius: '100px' }}>
              ✓ Complétée
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? '28px' : '36px', fontWeight: 300, color: '#E8E6F0', marginBottom: '10px', lineHeight: 1.1 }}>
          {activePhase.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(232,230,240,0.5)', lineHeight: 1.6, marginBottom: '14px' }}>
          {activePhase.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {activePhase.frameworks.map(f => (
            <span key={f} style={{ fontSize: '11px', color: 'rgba(232,230,240,0.4)', padding: '3px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '100px' }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Phase progress bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(232,230,240,0.4)' }}>Progression</span>
          <span style={{ fontSize: '12px', color: activePhase.color }}>
            {phaseProgress(activePhase, answers).answered}/{phaseProgress(activePhase, answers).total}
          </span>
        </div>
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${phaseProgress(activePhase, answers).pct * 100}%`, background: activePhase.color, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(232,230,240,0.3)', marginTop: '4px' }}>
          {phaseProgress(activePhase, answers).pct >= 0.6
            ? '✓ Phase débloquée — continue pour enrichir ton profil'
            : `Réponds à ${Math.ceil(activePhase.questions.length * 0.6)} questions minimum pour valider`
          }
        </div>
      </div>

      {/* Interactive tools */}
      {activePhase.tools.includes('bigfive') && <div style={{ marginBottom: '24px' }}><BigFive scores={bigFive} onChange={handleBigFive} /></div>}
      {activePhase.tools.includes('energymatrix') && <div style={{ marginBottom: '24px' }}><EnergyMatrix selected={energyMatrix} onSelect={handleEnergyMatrix} /></div>}
      {activePhase.tools.includes('archetypes') && <div style={{ marginBottom: '24px' }}><Archetypes selected={archetype} onSelect={handleArchetype} /></div>}
      {activePhase.tools.includes('ikigai') && <div style={{ marginBottom: '24px' }}><IkigaiViz answers={answers} /></div>}

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activePhase.questions.map(q => (
          <QuestionCard key={q.id} question={q} phaseColor={activePhase.color} value={answers[q.id] || ''} onChange={handleAnswer} />
        ))}
      </div>

      {/* Phase complete CTA */}
      {completedPhases.includes(activePhase.id) && activePhase.id < 6 && !completedPhases.includes(activePhase.id + 1) && (
        <div style={{ marginTop: '32px', padding: isMobile ? '20px' : '24px', background: 'linear-gradient(135deg, rgba(74,124,89,0.12), rgba(74,124,89,0.06))', border: '1px solid rgba(74,124,89,0.3)', borderRadius: '12px', textAlign: 'center', animation: 'fadeIn 0.4s ease forwards' }}>
          <div style={{ fontSize: '20px', color: '#4A7C59', marginBottom: '8px' }}>✓</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#E8E6F0', marginBottom: '16px' }}>
            Phase {activePhase.number} validée · +{activePhase.xpReward} XP
          </p>
          <button
            onClick={() => setActivePhaseId(activePhase.id + 1)}
            style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${PHASES[activePhase.id].color}, ${PHASES[activePhase.id].color}cc)`, color: '#0A0A0F', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif" }}
          >
            Phase {String(activePhase.id + 1).padStart(2, '0')} →
          </button>
        </div>
      )}

      {/* All phases complete */}
      {completedPhases.includes(6) && activePhase.id === 6 && (
        <div style={{ marginTop: '32px', padding: isMobile ? '24px' : '32px', background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(184,92,56,0.08))', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '12px', textAlign: 'center', animation: 'fadeIn 0.4s ease forwards' }}>
          <div style={{ fontSize: '32px', color: '#C9A84C', marginBottom: '12px' }}>✦</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 300, color: '#E8E6F0', marginBottom: '8px' }}>Voyage accompli</h2>
          <p style={{ fontSize: '14px', color: 'rgba(232,230,240,0.5)', marginBottom: '20px' }}>
            Tu as traversé les 6 phases. Consulte ta synthèse et parle à ARIA.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('synthesis')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C9A84C, #B8923A)', color: '#0A0A0F', borderRadius: '100px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
              Voir ma synthèse
            </button>
            <button onClick={() => setActiveTab('coach')} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.07)', color: '#E8E6F0', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'DM Sans', sans-serif" }}>
              Parler à ARIA
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0A0A0F', overflow: 'hidden' }}>
        {/* Mobile top bar */}
        <div style={{ height: '52px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 300, color: '#E8E6F0', letterSpacing: '0.1em' }}>FORGE</span>

          {/* Progress bar center */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', margin: '0 16px' }}>
            <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${globalProgress * 100}%`, background: 'linear-gradient(90deg, #C9A84C, #B85C38)', transition: 'width 0.5s ease' }} />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(232,230,240,0.35)', whiteSpace: 'nowrap' }}>{Math.round(globalProgress * 100)}%</span>
          </div>

          {/* XP pill */}
          <div style={{ position: 'relative' }}>
            {xpAnim && (
              <div style={{ position: 'absolute', top: '-28px', right: 0, color: '#C9A84C', fontSize: '12px', fontWeight: 600, animation: 'xpFloat 2.2s ease forwards', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                +{xpAnim.amount} XP ✦
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '100px' }}>
              <span style={{ fontSize: '11px', color: '#C9A84C', fontWeight: 500 }}>{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Phase strip — only on journey tab */}
        {activeTab === 'journey' && (
          <PhaseStrip
            phases={PHASES}
            activePhaseId={activePhaseId}
            completedPhases={completedPhases}
            answers={answers}
            onSelect={setActivePhaseId}
            isPhaseAccessible={isPhaseAccessible}
          />
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'journey' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', WebkitOverflowScrolling: 'touch' }}>
              {phaseContent}
            </div>
          )}

          {activeTab === 'coach' && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Coach storageData={data} isMobile />
            </div>
          )}

          {activeTab === 'synthesis' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', WebkitOverflowScrolling: 'touch' }}>
              <Synthesis storageData={data} />
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0F', overflow: 'hidden' }}>
      {/* Desktop top bar */}
      <div style={{ height: '52px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '20px', flexShrink: 0, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ color: 'rgba(232,230,240,0.4)', fontSize: '16px', padding: '4px', borderRadius: '4px', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#E8E6F0'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,230,240,0.4)'}
        >☰</button>

        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', fontWeight: 300, color: '#E8E6F0', letterSpacing: '0.1em' }}>FORGE</span>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, maxWidth: '240px', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${globalProgress * 100}%`, background: 'linear-gradient(90deg, #C9A84C, #B85C38)', transition: 'width 0.5s ease' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(232,230,240,0.35)' }}>{Math.round(globalProgress * 100)}%</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', position: 'relative' }}>
          {xpAnim && (
            <div style={{ position: 'absolute', top: '-30px', right: 0, color: '#C9A84C', fontSize: '13px', fontWeight: 600, animation: 'xpFloat 2.2s ease forwards', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              +{xpAnim.amount} XP ✦
            </div>
          )}
          <div style={{ fontSize: '11px', color: 'rgba(232,230,240,0.4)', letterSpacing: '0.05em' }}>Niv. {level}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '100px' }}>
            <span style={{ fontSize: '11px', color: '#C9A84C', fontWeight: 500 }}>{totalXP} XP</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {[{ id: 'journey', label: 'Voyage' }, { id: 'coach', label: 'ARIA' }, { id: 'synthesis', label: 'Synthèse' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: activeTab === tab.id ? '#E8E6F0' : 'rgba(232,230,240,0.4)', background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent', transition: 'all 0.15s ease', letterSpacing: '0.02em' }}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'journey' && sidebarOpen && (
          <Sidebar
            phases={PHASES}
            activePhaseId={activePhaseId}
            completedPhases={completedPhases}
            answers={answers}
            onSelect={setActivePhaseId}
            isPhaseAccessible={isPhaseAccessible}
            totalXP={totalXP}
            level={level}
            levelXP={levelXP}
          />
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          {activeTab === 'journey' && phaseContent}
          {activeTab === 'coach' && (
            <div style={{ height: '100%', margin: '-32px -40px' }}>
              <Coach storageData={data} />
            </div>
          )}
          {activeTab === 'synthesis' && (
            <div style={{ maxWidth: '720px', margin: '0 auto', animation: 'fadeIn 0.3s ease forwards' }}>
              <Synthesis storageData={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
