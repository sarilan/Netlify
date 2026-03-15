import { useState, useCallback } from 'react';

export default function QuestionCard({ question, phaseColor, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const answered = value && value.length > 10;

  const handleChange = useCallback((e) => {
    onChange(question.id, e.target.value);
  }, [question.id, onChange]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${answered ? `${phaseColor}40` : 'rgba(255,255,255,0.08)'}`,
      borderRadius: '12px',
      padding: '24px',
      transition: 'border-color 0.2s ease',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
        {question.deep && (
          <span style={{
            color: phaseColor,
            fontSize: '14px',
            marginTop: '2px',
            flexShrink: 0,
          }}>✦</span>
        )}
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '17px',
          fontWeight: 400,
          color: '#E8E6F0',
          lineHeight: 1.5,
        }}>
          {question.text}
        </p>
      </div>

      {question.hint && (
        <p style={{
          fontSize: '12px',
          color: 'rgba(232,230,240,0.4)',
          marginBottom: '14px',
          lineHeight: 1.5,
          paddingLeft: question.deep ? '24px' : '0',
        }}>
          {question.hint}
        </p>
      )}

      <div style={{ position: 'relative' }}>
        <textarea
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Prends le temps d'explorer cette question..."
          style={{
            width: '100%',
            minHeight: '100px',
            background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${focused ? `${phaseColor}60` : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '8px',
            padding: '14px',
            color: '#E8E6F0',
            fontSize: '14px',
            lineHeight: 1.6,
            resize: 'vertical',
            outline: 'none',
            transition: 'all 0.2s ease',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
        }}>
          {answered && (
            <span style={{ color: phaseColor, fontSize: '12px' }}>✓</span>
          )}
          <span style={{ fontSize: '11px', color: 'rgba(232,230,240,0.25)' }}>
            {(value || '').length}
          </span>
        </div>
      </div>
    </div>
  );
}
