'use client';

import { useState } from 'react';

const PIX_KEY = 'Ricardo.rogerios@hotmail.com';

export default function PixBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = PIX_KEY;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        background: 'rgba(201,163,90,0.15)',
        border: '1.5px solid rgba(201,163,90,0.55)',
        borderRadius: '10px',
        padding: '18px 20px',
        marginBottom: '16px',
      }}
    >
      <p style={{ color: '#c9a35a', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
        💳 PAGUE ANTES DE AGENDAR
      </p>
      <p style={{ color: 'rgba(245,239,226,0.7)', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-dm-sans)' }}>
        Chave PIX (e-mail):
      </p>
      <p style={{ color: '#e0bd72', fontSize: '15px', fontWeight: 700, marginBottom: '12px', wordBreak: 'break-all', fontFamily: 'var(--font-dm-sans)' }}>
        {PIX_KEY}
      </p>
      <button
        onClick={handleCopy}
        aria-label="Copiar chave PIX"
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1.5px solid #c9a35a',
          background: copied ? 'rgba(201,163,90,0.3)' : 'rgba(201,163,90,0.12)',
          color: copied ? '#e0bd72' : '#c9a35a',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '14px',
          fontFamily: 'var(--font-dm-sans)',
        }}
      >
        {copied ? '✓ Copiado!' : '📋 Copiar chave PIX'}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ color: 'rgba(245,239,226,0.65)', fontSize: '12px', fontFamily: 'var(--font-dm-sans)' }}>
          Beneficiário: <span style={{ color: 'rgba(245,239,226,0.9)' }}>Ricardo Rogerio da Silva</span>
        </p>
        <p style={{ color: 'rgba(245,239,226,0.65)', fontSize: '12px', fontFamily: 'var(--font-dm-sans)' }}>
          Banco: <span style={{ color: 'rgba(245,239,226,0.9)' }}>Itaú</span>
        </p>
        <p style={{ color: '#e0bd72', fontSize: '16px', fontWeight: 700, marginTop: '4px', fontFamily: 'var(--font-dm-sans)' }}>
          Valor: R$ 55,00
        </p>
      </div>
      <p style={{ color: 'rgba(245,239,226,0.55)', fontSize: '11px', fontStyle: 'italic', marginTop: '10px', lineHeight: 1.5, fontFamily: 'var(--font-dm-sans)' }}>
        Após o pagamento, agende abaixo e envie o comprovante no WhatsApp.
      </p>
    </div>
  );
}
