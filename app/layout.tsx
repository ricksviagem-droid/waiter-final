import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Veredito — Simulador de Viabilidade para Restaurantes',
  description:
    'Dados reais. Resposta honesta. Antes de você assinar qualquer coisa. Analise a viabilidade do seu restaurante ou delivery com dados de SEBRAE, ABRASEL e IBGE.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  )
}
