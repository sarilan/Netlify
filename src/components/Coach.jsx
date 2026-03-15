import { useState, useRef, useEffect } from 'react';
import { PHASES, OCEAN_DIMENSIONS } from '../phases';
import { useIsMobile } from '../hooks/useIsMobile';

function buildSystemPrompt(data) {
  const answers = data.answers || {};
  const bigFive = data.bigfive || {};
  const completedPhases = data.completedPhases || [];
  const archetype = data.archetype || null;

  let profile = `Tu es ARIA, une coach de découverte de vocation. Tu guides ${data.userName || 'l\'utilisateur'} avec un style direct, bienveillant, sans platitudes. Tu tutoies. Tu ne poses pas de questions génériques — tu challenges les réponses spécifiques de l'utilisateur.

Ton rôle : aider à clarifier, approfondir, et challenger les réflexions de l'utilisateur pour qu'il découvre sa vocation professionnelle réelle.

Règles :
- Sois direct et concis. Pas de "Bien sûr !" ou "Excellente question !".
- Utilise les réponses de l'utilisateur dans tes réponses.
- Challenge les incohérences que tu détectes.
- Une question max par réponse si tu poses une question.
- Réponses en français. Tutoiement.

=== PROFIL DE L'UTILISATEUR ===

Phases complétées : ${completedPhases.length > 0 ? completedPhases.map(p => `Phase ${p}`).join(', ') : 'Aucune pour l\'instant'}

`;

  // Big Five scores
  if (Object.keys(bigFive).length > 0) {
    profile += `\nScores Big Five OCEAN :\n`;
    OCEAN_DIMENSIONS.forEach(dim => {
      const score = bigFive[dim.id];
      if (score) {
        profile += `- ${dim.name} : ${score}/5 (${score <= 2 ? dim.low : score >= 4 ? dim.high : 'équilibré'})\n`;
      }
    });
  }

  if (archetype) {
    profile += `\nArchétype dominant : ${archetype}\n`;
  }

  // All answers
  const answerKeys = Object.keys(answers);
  if (answerKeys.length > 0) {
    profile += `\n=== RÉPONSES AUX QUESTIONS ===\n\n`;
    PHASES.forEach(phase => {
      const phaseAnswers = phase.questions.filter(q => answers[q.id] && answers[q.id].length > 5);
      if (phaseAnswers.length > 0) {
        profile += `--- Phase ${phase.number} : ${phase.title} ---\n`;
        phaseAnswers.forEach(q => {
          profile += `Q: ${q.text}\nR: ${answers[q.id]}\n\n`;
        });
      }
    });
  }

  return profile;
}

const ARIA_INTRO = `Bonjour. Je suis ARIA.

Je suis là pour t'aider à clarifier ta vocation — pas pour te rassurer, mais pour t'aider à voir ce que tu évites parfois de voir.

Réponds à quelques questions dans les phases d'abord, et on pourra travailler ensemble sur ce qui émerge. Ou si tu veux démarrer maintenant, dis-moi ce qui t'a amené ici.`;

export default function Coach({ storageData, isMobile: isMobileProp }) {
  const isMobileHook = useIsMobile();
  const isMobile = isMobileProp ?? isMobileHook;
  const [messages, setMessages] = useState([
    { role: 'assistant', content: ARIA_INTRO }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;
    if (!apiKey) {
      setApiKeyMissing(true);
      return;
    }

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(storageData);
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg = { role: 'assistant', content: data.content[0].text };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `[Erreur de connexion : ${err.message}. Vérifie ta clé API dans .env (VITE_ANTHROPIC_KEY).]`
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '14px 16px' : '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(184,92,56,0.2))',
            border: '1px solid rgba(201,168,76,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>✦</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#E8E6F0' }}>ARIA</div>
            <div style={{ fontSize: '12px', color: 'rgba(232,230,240,0.4)' }}>
              Coach IA · Connait ton profil complet
            </div>
          </div>
          <div style={{
            marginLeft: 'auto',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: loading ? '#C9A84C' : '#4A7C59',
            animation: loading ? 'pulse 1s ease infinite' : 'none',
          }} />
        </div>
      </div>

      {apiKeyMissing && (
        <div style={{
          margin: '16px',
          padding: '14px 16px',
          background: 'rgba(184,92,56,0.1)',
          border: '1px solid rgba(184,92,56,0.3)',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#B85C38',
        }}>
          <strong>Clé API manquante.</strong> Crée un fichier <code>.env</code> à la racine du projet avec :
          <br /><code>VITE_ANTHROPIC_KEY=sk-ant-...</code>
          <br />Puis relance le serveur avec <code>npm run dev</code>.
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '16px' : '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.2s ease forwards',
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.12))'
                : 'rgba(255,255,255,0.06)',
              border: msg.role === 'user'
                ? '1px solid rgba(201,168,76,0.25)'
                : '1px solid rgba(255,255,255,0.08)',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#E8E6F0',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px 16px 16px 4px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'rgba(232,230,240,0.4)',
                  animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: isMobile ? '12px 16px' : '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Parle à ARIA..."
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#E8E6F0',
              fontSize: '16px', /* ≥16px prevents iOS zoom on focus */
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              maxHeight: '120px',
              overflowY: 'auto',
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #C9A84C, #B8923A)'
                : 'rgba(255,255,255,0.06)',
              border: 'none',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              color: input.trim() && !loading ? '#0A0A0F' : 'rgba(232,230,240,0.3)',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
