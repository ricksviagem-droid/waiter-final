import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

interface Props {
  data: { date: string; balance: number }[]
}

export function SparklineChart({ data }: Props) {
  const min = Math.min(...data.map(d => d.balance))
  const max = Math.max(...data.map(d => d.balance))
  const trending = data[data.length - 1].balance >= data[0].balance
  const color = trending ? '#22c55e' : '#ef4444'

  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide />
        <Tooltip
          contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
          formatter={(v: number) => [v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Saldo']}
          labelFormatter={(l: string) => new Date(l).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
        />
        <Area type="monotone" dataKey="balance" stroke={color} strokeWidth={2} fill="url(#sparkGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
