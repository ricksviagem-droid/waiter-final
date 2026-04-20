import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, BarChart2, List, Star, Bot, Target, FileText } from 'lucide-react'

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Início' },
  { to: '/sms',         icon: MessageSquare,   label: 'SMS' },
  { to: '/transactions',icon: List,            label: 'Gastos' },
  { to: '/charts',      icon: BarChart2,       label: 'Gráficos' },
  { to: '/score',       icon: Star,            label: 'Score' },
  { to: '/chat',        icon: Bot,             label: 'Chat IA' },
  { to: '/goals',       icon: Target,          label: 'Metas' },
  { to: '/report',      icon: FileText,        label: 'PDF' },
]

export default function Layout() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="grid grid-cols-8 max-w-lg mx-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
