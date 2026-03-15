import { PHASES, OCEAN_DIMENSIONS, ARCHETYPES } from '../phases';

const KEY_QUESTIONS = [
  { phaseId: 1, questionId: 'p1_flow_moments', label: 'Moments de flow', icon: '◎' },
  { phaseId: 1, questionId: 'p1_natural_value', label: 'Valeur naturelle', icon: '✦' },
  { phaseId: 1, questionId: 'p1_no_money', label: 'Sans contrainte financière', icon: '◈' },
  { phaseId: 2, questionId: 'p2_obsession', label: 'Obsessions spontanées', icon: '◉' },
  { phaseId: 2, questionId: 'p2_world_problem', label: 'Problème qui t\'anime', icon: '⬡' },
  { phaseId: 3, questionId: 'p3_signature', label: 'Compétence signature', icon: '▣' },
  { phaseId: 3, questionId: 'p3_natural_skills', label: 'Compétences naturelles', icon: '◈' },
  { phaseId: 4, questionId: 'p4_problem_solved', label: 'Problème que tu résous', icon: '◎' },
  { phaseId: 5, questionId: 'p5_intersection', label: 'Ikigai', icon: '✦' },
  { phaseId: 6, questionId: 'p6_hypothesis', label: 'Hypothèse de vocation', icon: '◉' },
  { phaseId: 6, questionId: 'p6_first_action', label: 'Premier pas', icon: '→' },
];

export default function Synthesis({ storageData }) {
  const answers = storageData.answers || {};
  const bigFive = storageData.bigfive || {};
  const archetype = storageData.archetype;

  const filledAnswers = KEY_QUESTIONS.filter(q => answers[q.questionId] && answers[q.questionId].length > 10);
  const hasContent = filledAnswers.length > 0 || Object.keys(bigFive).length > 0;

  const selectedArch = ARCHETYPES.find(a => a.id === archetype);

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '28px',
          fontWeight: 400,
          color: '#E8E6F0',
          marginBottom: '8px',
        }}>Ta synthèse</h2>
        <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.45)' }}>
          {hasContent
            ? `${filledAnswers.length} élément${filledAnswers.length > 1 ? 's' : ''} · Se construit au fil de tes réponses`
            : 'Réponds aux questions dans les phases pour voir ta synthèse se construire.'}
        </p>
      </div>

      {!hasContent && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'rgba(232,230,240,0.3)',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}>✦</div>
          <p style={{ fontSize: '15px', fontFamily: "'Cormorant Garamond', serif" }}>
            Commence par la Phase 01 pour voir ta synthèse émerger ici.
          </p>
        </div>
      )}

      {/* Big Five section */}
      {Object.keys(bigFive).length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <SectionTitle>Profil OCEAN</SectionTitle>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '20px 24px',
          }}>
            {OCEAN_DIMENSIONS.map(dim => {
              const score = bigFive[dim.id];
              if (!score) return null;
              return (
                <div key={dim.id} style={{ marginBottom: '14px', lastChild: { marginBottom: 0 } }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: dim.color, fontWeight: 500 }}>{dim.name}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(232,230,240,0.5)' }}>{score}/5</span>
                  </div>
                  <div style={{
                    height: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(score / 5) * 100}%`,
                      background: `linear-gradient(90deg, ${dim.color}80, ${dim.color})`,
                      borderRadius: '2px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(232,230,240,0.35)', marginTop: '4px' }}>
                    {score <= 2 ? dim.low : score >= 4 ? dim.high : 'Équilibré'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Archetype */}
      {selectedArch && (
        <div style={{ marginBottom: '32px' }}>
          <SectionTitle>Archétype dominant</SectionTitle>
          <div style={{
            background: `${selectedArch.color}10`,
            border: `1px solid ${selectedArch.color}30`,
            borderRadius: '12px',
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{
                fontSize: '24px',
                color: selectedArch.color,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${selectedArch.color}20`,
                borderRadius: '8px',
              }}>
                {selectedArch.icon}
              </span>
              <span style={{ fontSize: '18px', color: selectedArch.color, fontFamily: "'Cormorant Garamond', serif" }}>
                {selectedArch.name}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(232,230,240,0.65)', lineHeight: 1.6 }}>
              {selectedArch.description}
            </p>
          </div>
        </div>
      )}

      {/* Key answers */}
      {filledAnswers.length > 0 && (
        <div>
          <SectionTitle>Éléments clés</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filledAnswers.map(q => {
              const phase = PHASES.find(p => p.id === q.phaseId);
              return (
                <div
                  key={q.questionId}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    animation: 'fadeIn 0.3s ease forwards',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: phase?.color || '#C9A84C', fontSize: '14px' }}>{q.icon}</span>
                    <span style={{ fontSize: '11px', color: phase?.color || '#C9A84C', letterSpacing: '0.05em', fontWeight: 500 }}>
                      {q.label}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '10px',
                      color: 'rgba(232,230,240,0.25)',
                      padding: '2px 8px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '100px',
                    }}>
                      Phase {String(q.phaseId).padStart(2, '0')}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#E8E6F0',
                    lineHeight: 1.6,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                  }}>
                    "{answers[q.questionId]}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vocation hypothesis highlight */}
      {answers.p6_hypothesis && answers.p6_hypothesis.length > 10 && (
        <div style={{ marginTop: '32px' }}>
          <SectionTitle>Hypothèse de vocation</SectionTitle>
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(184,92,56,0.06))',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', color: '#C9A84C', marginBottom: '12px' }}>✦</div>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '20px',
              fontWeight: 300,
              color: '#E8E6F0',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              "{answers.p6_hypothesis}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: '16px',
      fontWeight: 400,
      color: 'rgba(232,230,240,0.5)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: '14px',
    }}>
      {children}
    </h3>
  );
}
