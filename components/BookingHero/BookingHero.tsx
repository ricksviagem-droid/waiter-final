import PixBlock from './PixBlock';

const steps = [
  {
    n: '1',
    title: 'Você clica no botão dourado',
    desc: 'Abre o calendário com os horários disponíveis. Sem cadastro complicado.',
  },
  {
    n: '2',
    title: 'Escolhe o melhor dia e hora',
    desc: 'Preenche nome, email, WhatsApp e responde 4 perguntinhas rápidas pra eu já te conhecer melhor.',
  },
  {
    n: '3',
    title: 'Recebe a confirmação no seu email ✉',
    desc: 'Na hora que agendar, chega o email com data, hora e tudo certo. Eu também recebo — sua reserva está garantida.',
  },
  {
    n: '4',
    title: 'O Google Calendar te avisa antes 🔔',
    desc: 'O convite cai no seu Google Agenda e o celular te lembra automaticamente da chamada. Não tem como esquecer.',
  },
  {
    n: '5',
    title: 'No horário, eu te ligo no WhatsApp 📱',
    desc: 'Você só precisa estar com o celular na mão, bateria carregada e fone de ouvido. Fica num lugar tranquilo.',
  },
  {
    n: '6',
    title: 'Depois da conversa, recebe orientação por email',
    desc: 'Diagnóstico completo do seu perfil + próximos passos pra você seguir. Tudo escrito pra você não esquecer.',
  },
];

export default function BookingHero() {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0a1929 0%, #0f2340 100%)',
        width: '100%',
        padding: '0 0 48px',
      }}
    >
      <div
        style={{
          maxWidth: '580px',
          margin: '0 auto',
          padding: '40px 20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {/* ── TOPO: Logo + Badge + H1 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '28px' }}>
          {/* Logo placeholder */}
          <div
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: '#0f2340',
              border: '2px solid #c9a35a',
              boxShadow: '0 0 32px rgba(201,163,90,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span style={{ color: '#c9a35a', fontSize: '10px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-sans)' }}>BRAZIL</span>
            <span style={{ color: '#e0bd72', fontSize: '10px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-sans)' }}>ABROAD</span>
          </div>

          {/* Badge */}
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #c9a35a, #e0bd72)',
              color: '#0a1929',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '4px 14px',
              borderRadius: '999px',
              marginBottom: '20px',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            BRAZIL ABROAD
          </span>

          {/* H1 */}
          <h1
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(28px, 7vw, 40px)',
              fontWeight: 600,
              color: '#f5efe2',
              lineHeight: 1.15,
              marginBottom: '14px',
            }}
          >
            Sua carreira internacional{' '}
            <em style={{ color: '#e0bd72', fontStyle: 'italic' }}>começa aqui.</em>
          </h1>

          {/* Subtítulo */}
          <p
            style={{
              color: 'rgba(245,239,226,0.75)',
              fontSize: '15px',
              lineHeight: 1.6,
              fontFamily: 'var(--font-dm-sans)',
              maxWidth: '460px',
            }}
          >
            Sou o Rick. Ajudo brasileiros a conquistarem vagas em hospitalidade no exterior — Emirados, cruzeiros e EUA.
          </p>
        </div>

        {/* ── CREDENCIAIS ── */}
        <div
          style={{
            borderTop: '1px solid rgba(201,163,90,0.4)',
            borderBottom: '1px solid rgba(201,163,90,0.4)',
            padding: '14px 0',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          <p style={{ color: '#e0bd72', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-dm-sans)', marginBottom: '4px' }}>
            15 anos · 7 em Dubai
          </p>
          <p style={{ color: 'rgba(245,239,226,0.6)', fontSize: '12px', fontFamily: 'var(--font-dm-sans)' }}>
            Atlantis The Royal · Amazónico · Casa Blanca · Ling Ling
          </p>
        </div>

        {/* ── AVISO DE URGÊNCIA ── */}
        <div
          style={{
            border: '1px solid rgba(251,146,60,0.45)',
            borderRadius: '12px',
            padding: '16px 18px',
            marginBottom: '24px',
            background: 'rgba(251,146,60,0.06)',
          }}
        >
          <p style={{ color: '#fb923c', fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '8px', fontFamily: 'var(--font-dm-sans)' }}>
            ⚡ ATENÇÃO
          </p>
          <p style={{ color: 'rgba(245,239,226,0.8)', fontSize: '13px', lineHeight: 1.6, fontFamily: 'var(--font-dm-sans)' }}>
            As vagas estão sendo preenchidas rapidamente. Devido ao preço promocional, os horários estão acabando. Se você não encontrar disponibilidade, é porque já foram preenchidos — estamos trabalhando duro pra abrir novas vagas em breve. 💪
          </p>
        </div>

        {/* ── CARD 1: Diagnóstico Grátis ── */}
        <div
          style={{
            background: 'rgba(201,163,90,0.08)',
            border: '2px solid #c9a35a',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '16px',
          }}
        >
          {/* Tag */}
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #c9a35a, #e0bd72)',
              color: '#0a1929',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '14px',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            🎁 100% GRÁTIS
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '22px',
              fontWeight: 600,
              color: '#f5efe2',
              marginBottom: '10px',
            }}
          >
            Diagnóstico Brazil Abroad
          </h2>

          <p style={{ color: 'rgba(245,239,226,0.75)', fontSize: '14px', lineHeight: 1.65, fontFamily: 'var(--font-dm-sans)', marginBottom: '16px' }}>
            15 minutos comigo pra entender seu perfil, seu inglês, seus objetivos e te dar um direcionamento personalizado dos próximos passos. Sem custo. Sem compromisso.
          </p>

          {/* Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['⏱ 15 min', '📱 WhatsApp Vídeo', '✨ Sem custo'].map((pill) => (
              <span
                key={pill}
                style={{
                  background: 'rgba(201,163,90,0.15)',
                  border: '1px solid rgba(201,163,90,0.35)',
                  color: '#e0bd72',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          {/* CTA botão */}
          <a
            href="https://calendly.com/ricardo-brazilabroad/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar diagnóstico grátis"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              background: 'linear-gradient(90deg, #c9a35a, #e0bd72)',
              color: '#0a1929',
              fontWeight: 700,
              fontSize: '15px',
              padding: '15px 20px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans)',
              transition: 'opacity 0.2s',
            }}
          >
            Agendar diagnóstico grátis →
          </a>
        </div>

        {/* ── CARD 2: Aula Particular ── */}
        <div
          style={{
            background: 'rgba(15,35,64,0.8)',
            border: '1.5px solid rgba(201,163,90,0.35)',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '28px',
          }}
        >
          {/* Tag */}
          <span
            style={{
              display: 'inline-block',
              border: '1.5px solid #c9a35a',
              color: '#c9a35a',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '14px',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            🎓 PRIVATE CLASS
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '22px',
              fontWeight: 600,
              color: '#f5efe2',
              marginBottom: '10px',
            }}
          >
            Aula Particular — R$ 55
          </h2>

          <p style={{ color: 'rgba(245,239,226,0.75)', fontSize: '14px', lineHeight: 1.65, fontFamily: 'var(--font-dm-sans)', marginBottom: '16px' }}>
            45 minutos comigo, individual. Correção de currículo, roleplay de entrevista, vocabulário de service de luxo e plano personalizado. O menor preço do Brasil em inglês pra hospitalidade.
          </p>

          {/* Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['⏱ 45 min', '📱 WhatsApp Vídeo', '💰 PIX R$ 55'].map((pill) => (
              <span
                key={pill}
                style={{
                  background: 'rgba(201,163,90,0.12)',
                  border: '1px solid rgba(201,163,90,0.3)',
                  color: '#e0bd72',
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-dm-sans)',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          {/* PIX Block */}
          <PixBlock />

          {/* Botão Aula */}
          <a
            href="https://calendly.com/ricardo-brazilabroad/private-class"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Agendar aula particular"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              background: 'rgba(201,163,90,0.15)',
              color: '#e0bd72',
              border: '1.5px solid #c9a35a',
              fontWeight: 700,
              fontSize: '15px',
              padding: '14px 20px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Agendar aula particular →
          </a>
        </div>

        {/* ── COMO FUNCIONA ── */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span
              style={{
                display: 'inline-block',
                border: '1px solid rgba(201,163,90,0.4)',
                color: '#c9a35a',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                padding: '4px 12px',
                borderRadius: '999px',
                marginBottom: '12px',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              PASSO A PASSO
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: '22px',
                fontWeight: 600,
                color: '#f5efe2',
                lineHeight: 1.2,
              }}
            >
              Como funciona{' '}
              <em style={{ color: '#e0bd72', fontStyle: 'italic' }}>do começo ao fim.</em>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map(({ n, title, desc }) => (
              <div key={n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    borderRadius: '50%',
                    border: '1.5px solid #c9a35a',
                    background: 'rgba(201,163,90,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e0bd72',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-dm-sans)',
                  }}
                >
                  {n}
                </div>
                <div>
                  <p style={{ color: '#f5efe2', fontSize: '14px', fontWeight: 600, marginBottom: '3px', fontFamily: 'var(--font-dm-sans)' }}>
                    {title}
                  </p>
                  <p style={{ color: 'rgba(245,239,226,0.65)', fontSize: '13px', lineHeight: 1.55, fontFamily: 'var(--font-dm-sans)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CALLOUT: Papel e Caneta ── */}
        <div
          style={{
            borderLeft: '3px solid #c9a35a',
            paddingLeft: '16px',
            marginBottom: '24px',
          }}
        >
          <p style={{ color: '#c9a35a', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-dm-sans)' }}>
            📝 IMPORTANTE — ANTES DA CHAMADA
          </p>
          <p style={{ color: 'rgba(245,239,226,0.75)', fontSize: '13px', lineHeight: 1.65, fontFamily: 'var(--font-dm-sans)' }}>
            Tenha papel e caneta na mão pra anotar. Vou compartilhar direções importantes que serão a sua bússola dos próximos meses. Anotar é fundamental — o que você ouve esquece, o que escreve fica.
          </p>
        </div>

        {/* ── VERDADE NA CARA ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(201,163,90,0.08) 0%, rgba(201,163,90,0.04) 100%)',
            border: '1px solid rgba(201,163,90,0.3)',
            borderRadius: '14px',
            padding: '22px 20px',
            marginBottom: '24px',
          }}
        >
          <h4
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '20px',
              fontWeight: 600,
              color: '#f5efe2',
              marginBottom: '14px',
              lineHeight: 1.2,
            }}
          >
            Aqui não tem{' '}
            <em style={{ color: '#e0bd72', fontStyle: 'italic' }}>falcatrua.</em>
          </h4>
          <p style={{ color: 'rgba(245,239,226,0.75)', fontSize: '13px', lineHeight: 1.65, fontFamily: 'var(--font-dm-sans)', marginBottom: '10px' }}>
            A verdade é falada na cara. Se você não estiver preparado, fica impossível te direcionar — e eu vou te dizer isso olhando no olho.
          </p>
          <p style={{ color: 'rgba(245,239,226,0.75)', fontSize: '13px', lineHeight: 1.65, fontFamily: 'var(--font-dm-sans)', marginBottom: '10px' }}>
            Temos parceiros recrutadores e trabalhamos com intercâmbio também. Mas não garantimos vaga. Nós te preparamos pra que <strong style={{ color: '#f5efe2' }}>VOCÊ conquiste a sua.</strong>
          </p>
          <p style={{ color: 'rgba(245,239,226,0.75)', fontSize: '13px', lineHeight: 1.65, fontFamily: 'var(--font-dm-sans)' }}>
            Vai dar trabalho. Vai exigir disciplina. Mas tenho certeza que você vai conseguir.
          </p>
        </div>

        {/* ── CITAÇÃO PESSOAL ── */}
        <div
          style={{
            background: 'rgba(10,25,41,0.8)',
            border: '1px solid rgba(201,163,90,0.2)',
            borderRadius: '14px',
            padding: '28px 24px 22px',
            marginBottom: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '16px',
              fontSize: '72px',
              lineHeight: 1,
              color: 'rgba(201,163,90,0.2)',
              fontFamily: 'Georgia, serif',
              userSelect: 'none',
            }}
          >
            "
          </span>
          <p
            style={{
              color: 'rgba(245,239,226,0.85)',
              fontSize: '15px',
              lineHeight: 1.7,
              fontStyle: 'italic',
              fontFamily: 'var(--font-fraunces)',
              marginBottom: '16px',
              position: 'relative',
              zIndex: 1,
              paddingTop: '24px',
            }}
          >
            Se aconteceu comigo 3 vezes, e tudo pago do meu bolso — por que não pode acontecer com você também?
          </p>
          <p style={{ color: '#c9a35a', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-sans)' }}>
            — Rick · Brazil Abroad
          </p>
        </div>

        {/* ── DIVISOR FINAL ── */}
        <div style={{ textAlign: 'center', padding: '8px 0 0' }}>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,163,90,0.4), transparent)', marginBottom: '16px' }} />
          <p style={{ color: 'rgba(201,163,90,0.6)', fontSize: '13px', fontStyle: 'italic', fontFamily: 'var(--font-fraunces)', letterSpacing: '0.05em' }}>
            We'll get you fit for duty.
          </p>
        </div>
      </div>
    </div>
  );
}
