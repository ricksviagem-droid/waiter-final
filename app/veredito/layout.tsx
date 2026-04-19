import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veredito — Simulador de Viabilidade para Restaurantes',
  description:
    'Dados reais. Resposta honesta. Antes de você assinar qualquer coisa. Analise a viabilidade do seu restaurante ou delivery com dados de SEBRAE, ABRASEL e IBGE.',
}

export default function VereditorLayout({ children }: { children: React.ReactNode }) {
  return children
}
