import { useState, useCallback, useEffect } from 'react';
import { PHASES } from '../phases';
import { useStorage } from '../hooks/useStorage';
import QuestionCard from './QuestionCard';
import BigFive from './BigFive';
import EnergyMatrix from './EnergyMatrix';
import Archetypes from './Archetypes';
import IkigaiViz from './IkigaiViz';
import Coach from './Coach';
import Synthesis from './Synthesis';

const XP_ANIM_DURATION = 2200;

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

export default function Journey() {
  const { data, set, setNested, get, getNested } = useStorage();
  const [activePhaseId, setActivePhaseId] = useState(1);
  const [activeTab, setActiveTab] = useState('journey'); // 'journey' | 'coach' | 'synthesis'
  const [xpAnim, setXpAnim] = useState(null); // { amount, phaseId }
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const answers = data.answers || {};
  const bigFive = data.bigfive || {};
  const completedPhases = data.completedPhases || [];
  const energyMatrix = data.energyMatrix || null;
  const archetype = data.archetype || null;

  const totalXP = calcTotalXP(completedPhases);
  const level = Math.floor(totalXP / 300) + 1;
  const levelXP = totalXP % 300;

  const handleAnswer = useCallback((qId, value) => {
    setNested('answers', qId, value);
  }, [setNested]);

  const handleBigFive = useCallback((dimId, score) => {
    setNested('bigfive', dimId, score);
  }, [setNested]);

  const handleEnergyMatrix = useCallback((quadrantId) => {
    set('energyMatrix', quadrantId);
  }, [set]);

  const handleArchetype = useCallback((archId) => {
    set('archetype', archId);
  }, [set]);

  // Auto-complete phases
  useEffect(() => {
    const activePhase = PHASES.find(p => p.id === activePhaseId);
    if (!activePhase) return;

    const currentAnswers = data.answers || {};
    const complete = isPhaseComplete(activePhase, currentAnswers);
    const wasComplete = completedPhases.includes(activePhaseId);

    if (complete && !wasComplete) {
      const newCompleted = [...completedPhases, activePhaseId];
      set('completedPhases', newCompleted);
      // Trigger XP animation
      setXpAnim({ amount: activePhase.xpReward, phaseId: activePhaseId });
      setTimeout(() => setXpAnim(null), XP_ANIM_DURATION);
    }
  }, [data.answers, activePhaseId, completedPhases, set]);

  const activePhase = PHASES.find(p => p.id === activePhaseId);
  const globalProgress = PHASES.reduce((sum, p) => {
    return sum + phaseProgress(p, answers).pct;
  }, 0) / PHASES.length;

  // Check if a phase is accessible
  const isPhaseAccessible = (phaseId) => {
    if (phaseId === 1) return true;
    return completedPhases.includes(phaseId - 1);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0A0A0F',
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        height: '52px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '20px',
        flexShrink: 0,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
      }}>
        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            color: 'rgba(232,230,240,0.4)',
            fontSize: '16px',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#E8E6F0'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,230,240,0.4)'}
        >
          ☰
        </button>

        {/* Logo */}
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '22px',
          fontWeight: 300,
          color: '#E8E6F0',
          letterSpacing: '0.1em',
        }}>FORGE</span>

        {/* Global progress */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            flex: 1,
            maxWidth: '240px',
            height: '2px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${globalProgress * 100}%`,
              background: 'linear-gradient(90deg, #C9A84C, #B85C38)',
              borderRadius: '1px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(232,230,240,0.35)' }}>
            {Math.round(globalProgress * 100)}%
          </span>
        </div>

        {/* XP / Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', position: 'relative' }}>
          {xpAnim && (
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '0',
              color: '#C9A84C',
              fontSize: '13px',
              fontWeight: 600,
              animation: 'xpFloat 2.2s ease forwards',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              +{xpAnim.amount} XP ✦
            </div>
          )}
          <div style={{
            fontSize: '11px',
            color: 'rgba(232,230,240,0.4)',
            letterSpacing: '0.05em',
          }}>Niv. {level}</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '100px',
          }}>
            <span style={{ fontSize: '11px', color: '#C9A84C', fontWeight: 500 }}>
              {totalXP} XP
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'journey', label: 'Voyage' },
            { id: 'coach', label: 'ARIA' },
            { id: 'synthesis', label: 'Synthèse' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                color: activeTab === tab.id ? '#E8E6F0' : 'rgba(232,230,240,0.4)',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'all 0.15s ease',
                letterSpacing: '0.02em',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        {activeTab === 'journey' && sidebarOpen && (
          <div style={{
            width: '220px',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            overflowY: 'auto',
            padding: '16px 12px',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.01)',
            animation: 'slideIn 0.2s ease forwards',
          }}>
            {PHASES.map(phase => {
              const prog = phaseProgress(phase, answers);
              const isActive = activePhaseId === phase.id;
              const isComplete = completedPhases.includes(phase.id);
              const accessible = isPhaseAccessible(phase.id);

              return (
                <button
                  key={phase.id}
                  onClick={() => accessible && setActivePhaseId(phase.id)}
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
                  onMouseEnter={e => {
                    if (accessible && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '11px',
                      color: phase.color,
                      letterSpacing: '0.08em',
                    }}>
                      {phase.number}
                    </span>
                    {isComplete && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '10px',
                        color: phase.color,
                      }}>✓</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: isActive ? '#E8E6F0' : 'rgba(232,230,240,0.6)',
                    fontWeight: isActive ? 500 : 400,
                    marginBottom: '6px',
                    lineHeight: 1.3,
                  }}>
                    {phase.title}
                  </div>
                  {/* Mini progress */}
                  <div style={{
                    height: '2px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '1px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${prog.pct * 100}%`,
                      background: phase.color,
                      opacity: 0.7,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(232,230,240,0.3)', marginTop: '4px' }}>
                    {prog.answered}/{prog.total} questions
                  </div>
                </button>
              );
            })}

            {/* XP breakdown */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em', marginBottom: '8px' }}>
                PROGRESSION XP
              </div>
              <div style={{ fontSize: '18px', color: '#C9A84C', fontFamily: "'Cormorant Garamond', serif", marginBottom: '4px' }}>
                {totalXP} XP
              </div>
              <div style={{
                height: '3px',
                background: 'rgba(201,168,76,0.15)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '4px',
              }}>
                <div style={{
                  height: '100%',
                  width: `${(levelXP / 300) * 100}%`,
                  background: '#C9A84C',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(232,230,240,0.3)' }}>
                Niv. {level} · {levelXP}/300 vers niv. {level + 1}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

          {activeTab === 'journey' && activePhase && (
            <div style={{ maxWidth: '720px', margin: '0 auto', animation: 'fadeIn 0.3s ease forwards' }}>
              {/* Phase header */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '13px',
                    color: activePhase.color,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    Phase {activePhase.number}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: activePhase.color,
                    padding: '2px 8px',
                    background: `${activePhase.color}15`,
                    border: `1px solid ${activePhase.color}30`,
                    borderRadius: '100px',
                  }}>
                    {activePhase.subtitle}
                  </span>
                  {completedPhases.includes(activePhase.id) && (
                    <span style={{
                      fontSize: '11px',
                      color: '#4A7C59',
                      padding: '2px 8px',
                      background: 'rgba(74,124,89,0.12)',
                      border: '1px solid rgba(74,124,89,0.3)',
                      borderRadius: '100px',
                    }}>
                      ✓ Complétée
                    </span>
                  )}
                </div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '36px',
                  fontWeight: 300,
                  color: '#E8E6F0',
                  marginBottom: '10px',
                  lineHeight: 1.1,
                }}>
                  {activePhase.title}
                </h1>
                <p style={{ fontSize: '14px', color: 'rgba(232,230,240,0.5)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {activePhase.description}
                </p>

                {/* Frameworks */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activePhase.frameworks.map(f => (
                    <span key={f} style={{
                      fontSize: '11px',
                      color: 'rgba(232,230,240,0.4)',
                      padding: '3px 10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '100px',
                    }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress bar for phase */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(232,230,240,0.4)' }}>Progression de la phase</span>
                  <span style={{ fontSize: '12px', color: activePhase.color }}>
                    {phaseProgress(activePhase, answers).answered}/{phaseProgress(activePhase, answers).total}
                  </span>
                </div>
                <div style={{
                  height: '3px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${phaseProgress(activePhase, answers).pct * 100}%`,
                    background: activePhase.color,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(232,230,240,0.3)', marginTop: '4px' }}>
                  {phaseProgress(activePhase, answers).pct >= 0.6
                    ? '✓ Phase débloquée — continue pour enrichir ton profil'
                    : `Réponds à ${Math.ceil(activePhase.questions.length * 0.6)} questions minimum pour valider`
                  }
                </div>
              </div>

              {/* Interactive tools */}
              {activePhase.tools.includes('bigfive') && (
                <div style={{ marginBottom: '24px' }}>
                  <BigFive scores={bigFive} onChange={handleBigFive} />
                </div>
              )}
              {activePhase.tools.includes('energymatrix') && (
                <div style={{ marginBottom: '24px' }}>
                  <EnergyMatrix selected={energyMatrix} onSelect={handleEnergyMatrix} />
                </div>
              )}
              {activePhase.tools.includes('archetypes') && (
                <div style={{ marginBottom: '24px' }}>
                  <Archetypes selected={archetype} onSelect={handleArchetype} />
                </div>
              )}
              {activePhase.tools.includes('ikigai') && (
                <div style={{ marginBottom: '24px' }}>
                  <IkigaiViz answers={answers} />
                </div>
              )}

              {/* Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activePhase.questions.map(q => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    phaseColor={activePhase.color}
                    value={answers[q.id] || ''}
                    onChange={handleAnswer}
                  />
                ))}
              </div>

              {/* Phase complete CTA */}
              {completedPhases.includes(activePhase.id) && activePhase.id < 6 && !completedPhases.includes(activePhase.id + 1) && (
                <div style={{
                  marginTop: '32px',
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(74,124,89,0.12), rgba(74,124,89,0.06))',
                  border: '1px solid rgba(74,124,89,0.3)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  animation: 'fadeIn 0.4s ease forwards',
                }}>
                  <div style={{ fontSize: '20px', color: '#4A7C59', marginBottom: '8px' }}>✓</div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '18px',
                    color: '#E8E6F0',
                    marginBottom: '16px',
                  }}>
                    Phase {activePhase.number} validée · +{activePhase.xpReward} XP
                  </p>
                  <button
                    onClick={() => setActivePhaseId(activePhase.id + 1)}
                    style={{
                      padding: '12px 28px',
                      background: `linear-gradient(135deg, ${PHASES[activePhase.id].color}, ${PHASES[activePhase.id].color}cc)`,
                      color: '#0A0A0F',
                      borderRadius: '100px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Passer à la Phase {String(activePhase.id + 1).padStart(2, '0')}
                  </button>
                </div>
              )}

              {/* Final phase complete */}
              {completedPhases.includes(6) && activePhase.id === 6 && (
                <div style={{
                  marginTop: '32px',
                  padding: '32px',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(184,92,56,0.08))',
                  border: '1px solid rgba(201,168,76,0.4)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  animation: 'fadeIn 0.4s ease forwards',
                }}>
                  <div style={{ fontSize: '32px', color: '#C9A84C', marginBottom: '12px' }}>✦</div>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '28px',
                    fontWeight: 300,
                    color: '#E8E6F0',
                    marginBottom: '8px',
                  }}>Voyage accompli</h2>
                  <p style={{ fontSize: '14px', color: 'rgba(232,230,240,0.5)', marginBottom: '20px' }}>
                    Tu as traversé les 6 phases. Maintenant, l'essentiel : consulte ta synthèse et parle à ARIA.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setActiveTab('synthesis')}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #C9A84C, #B8923A)',
                        color: '#0A0A0F',
                        borderRadius: '100px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Voir ma synthèse
                    </button>
                    <button
                      onClick={() => setActiveTab('coach')}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(255,255,255,0.07)',
                        color: '#E8E6F0',
                        borderRadius: '100px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        border: '1px solid rgba(255,255,255,0.12)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Parler à ARIA
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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
