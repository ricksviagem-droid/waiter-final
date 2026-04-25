import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const posts: Record<string, {
  category: string;
  date: string;
  readTime: string;
  color: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  cta_text: string;
}> = {
  'como-conseguir-emprego-cruzeiro-2026': {
    category: 'Cruzeiros',
    date: 'Abr 2026',
    readTime: '5 min',
    color: '#1A4A6B',
    title: 'Como conseguir emprego num cruzeiro em 2026',
    intro: 'Trabalhar num navio de cruzeiro é uma das formas mais rápidas de acumular dólar e ver o mundo ao mesmo tempo. Mas tem um caminho certo — e muita gente erra logo no começo.',
    sections: [
      {
        heading: 'O que você precisa ter',
        body: 'Experiência mínima em restaurante ou hotel (mesmo no Brasil conta), inglês funcional — não precisa ser perfeito —, e documentos em dia: passaporte válido, carteira de vacinação, e em alguns casos certificado STCW (segurança marítima básica, que algumas companhias providenciam depois da contratação).',
      },
      {
        heading: 'Por onde começa',
        body: 'O erro mais comum é mandar currículo direto para o site da companhia e nunca receber resposta. O caminho certo é ir por agências especializadas — como a The Work, nosso parceiro recrutador. Elas têm vagas que não aparecem em nenhum site público e já conhecem o perfil que cada companhia busca.',
      },
      {
        heading: 'As companhias que mais contratam brasileiros',
        body: 'MSC Cruises, Royal Caribbean e Celebrity Cruises são as que têm mais brasileiros a bordo e mais abertura para contratar quem está começando. Norwegian e Princess Cruises também têm boas oportunidades, mas exigem inglês mais sólido.',
      },
      {
        heading: 'Salário real: o que esperar',
        body: 'Garçom (waiter) de restaurante principal: entre $1.800 e $2.500 de salário fixo + gorjetas que podem dobrar esse valor. Sommelier ou Head Waiter: $3.000 a $4.500. Lembre: moradia e alimentação são incluídos. Então o que você recebe é praticamente liquido.',
      },
      {
        heading: 'O que ninguém te conta',
        body: 'O ritmo é intenso: turnos duplos, pouco tempo livre nos primeiros contratos. Mas quem resiste ao primeiro contrato quase sempre assina o segundo — porque os ganhos valem muito, e a experiência muda a perspectiva de carreira para sempre.',
      },
    ],
    cta_text: 'Quer saber se você já está pronto? Faça o assessment gratuito e descubra seu perfil.',
  },

  'dubai-vs-cruzeiros-qual-escolher': {
    category: 'Destinos',
    date: 'Abr 2026',
    readTime: '4 min',
    color: '#C9963A',
    title: 'Dubai vs Cruzeiros — qual escolher?',
    intro: 'Essa é a pergunta que mais recebo. Não existe resposta errada — mas existe a resposta certa para o SEU perfil. Vou comparar as duas opções de forma honesta.',
    sections: [
      {
        heading: 'Salário: Dubai leva vantagem',
        body: 'Dubai paga mais para cargos de nível médio e sênior. Um bartender no Atlantis The Royal pode ganhar $4.500 a $6.000/mês. Num cruzeiro o mesmo cargo fica entre $2.800 e $4.000. A diferença aparece principalmente em gorjetas — em Dubai, em restaurantes de luxo, as gorjetas são expressivas.',
      },
      {
        heading: 'Custo de vida: cruzeiro ganha fácil',
        body: 'A bordo você não paga moradia, alimentação, nem transporte. O que entra fica. Em Dubai, mesmo com salário alto, você paga aluguel (caro), alimentação e deslocamento. O percentual poupado por contrato costuma ser parecido entre os dois caminhos.',
      },
      {
        heading: 'Inglês: nível exigido',
        body: 'Cruzeiros aceitam inglês intermediário funcional para posições de entrada. Dubai, principalmente nos estabelecimentos de luxo, exige inglês avançado e muitas vezes um segundo idioma. Se seu inglês ainda está em desenvolvimento, comece pelo cruzeiro.',
      },
      {
        heading: 'Estilo de vida',
        body: 'No cruzeiro você vive dentro do trabalho. A liberdade é menor, mas você vê múltiplos países por contrato. Em Dubai você tem uma vida "normal" fora do trabalho — apartamento, vida social, explorar a cidade. Para quem quer estabilidade e crescer numa cidade, Dubai é melhor. Para quem quer acumular dinheiro rápido e ver o mundo, cruzeiro.',
      },
      {
        heading: 'Qual escolher?',
        body: 'Se você está começando e o inglês ainda não está forte: cruzeiro. Se você já tem experiência sólida e inglês avançado: Dubai. Se quer os dois — começa no cruzeiro, acumula experiência internacional, e vem para Dubai. Esse é o caminho que eu fiz e que recomendo.',
      },
    ],
    cta_text: 'Não sabe qual é o seu perfil? Faça o assessment e descubra o caminho certo para você.',
  },

  '3-erros-brasileiros-rejeitados-exterior': {
    category: 'Carreira',
    date: 'Abr 2026',
    readTime: '3 min',
    color: '#2d6a4f',
    title: '3 coisas que fazem brasileiros serem rejeitados no exterior',
    intro: 'Já vi centenas de brasileiros talentosos serem rejeitados por erros que eram completamente evitáveis. Aqui estão os três mais comuns — e como corrigir cada um.',
    sections: [
      {
        heading: '1. Currículo no formato brasileiro',
        body: 'Foto 3x4, data de nascimento, estado civil, objetivo de vida — tudo isso é informação que você NÃO coloca num currículo internacional. O padrão internacional é uma página, em inglês, focado em resultados e números. "Atendi 120 clientes por turno" é melhor do que "responsável pelo atendimento ao cliente". Recrutadores internacionais descartam currículos brasileiros no formato errado nos primeiros 10 segundos.',
      },
      {
        heading: '2. Inglês de curso, não de uso',
        body: 'Inglês para entrevista é diferente de inglês para prova. Muita gente sabe gramática mas trava quando precisa responder "Tell me about yourself" de improviso. A solução é praticar conversas reais — não repetir frases de livro. O nosso simulador de entrevistas com IA foi feito exatamente para isso: você pratica até a resposta sair natural.',
      },
      {
        heading: '3. Falta de contato direto com recrutadores',
        body: 'Mandar currículo pelo formulário do site e esperar. Esse é o jeito mais lento — e muitas vezes ineficaz. Os cargos bons são preenchidos por indicação ou por agências especializadas antes de serem anunciados publicamente. Estar na rede certa, com as pessoas certas, faz toda a diferença. Por isso a Brazil Abroad existe: para encurtar esse caminho.',
      },
    ],
    cta_text: 'Quer saber exatamente onde você está hoje? Faça o assessment gratuito — leva 3 minutos.',
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="bg-[#FDFAF4] pt-16 min-h-screen">

        {/* Hero */}
        <section className="py-14 px-5 border-b border-[#e8e0d0]">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full text-white font-[family-name:var(--font-dm-sans)]"
                style={{ backgroundColor: post.color }}
              >
                {post.category}
              </span>
              <span className="text-[#999] text-xs font-[family-name:var(--font-dm-sans)]">
                {post.date} · {post.readTime} de leitura
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-[#555] text-lg leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {post.intro}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#e8e0d0]">
              <div className="w-9 h-9 rounded-full bg-[#1A4A6B] flex items-center justify-center text-white text-xs font-semibold font-[family-name:var(--font-fraunces)]">
                R
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a] font-[family-name:var(--font-dm-sans)]">Ricardo Rogerio</p>
                <p className="text-xs text-[#777] font-[family-name:var(--font-dm-sans)]">Fundador — Brazil Abroad · 15 anos em hospitalidade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Article body */}
        <section className="py-12 px-5">
          <div className="max-w-2xl mx-auto flex flex-col gap-10">
            {post.sections.map(({ heading, body }) => (
              <div key={heading}>
                <h2
                  className="font-[family-name:var(--font-fraunces)] text-xl font-semibold mb-3"
                  style={{ color: post.color }}
                >
                  {heading}
                </h2>
                <p className="text-[#444] text-base leading-relaxed font-[family-name:var(--font-dm-sans)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA block */}
        <section className="px-5 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1A4A6B] rounded-[16px] p-8 text-center">
              <p className="text-white text-base leading-relaxed font-[family-name:var(--font-dm-sans)] mb-6">
                {post.cta_text}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/assessment"
                  className="bg-[#C9963A] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#b8872f] transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
                >
                  Fazer assessment gratuito
                </Link>
                <Link
                  href="/blog"
                  className="border border-white/30 text-white font-medium px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors font-[family-name:var(--font-dm-sans)] text-sm"
                >
                  Ver mais artigos
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
