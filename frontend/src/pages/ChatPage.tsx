import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader2, Trash2, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: Date
}

const SUGGESTIONS = [
  'Quanto devo economizar por mês para sair das dívidas?',
  'Quais categorias estou gastando mais?',
  'Como está meu Safe to Spend hoje?',
  'Me dá um plano para juntar R$5.000 em 6 meses.',
  'Vale a pena quitar o empréstimo agora?',
  'Onde estou desperdiçando dinheiro?',
]

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} className="text-primary" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-card border border-border text-foreground rounded-tl-sm'
      }`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}
        <div className={`text-[10px] mt-1 ${isUser ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
          {msg.ts.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Olá! 👋 Sou seu assistente financeiro pessoal. Tenho acesso aos seus dados reais — saldo, gastos, Safe to Spend e metas. Me pergunte qualquer coisa sobre suas finanças!',
      ts: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, ts: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.ai.chat(content) as { reply: string }
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        ts: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua pergunta. Tente novamente.',
        ts: new Date(),
      }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function clearChat() {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: 'Chat limpo. Como posso ajudar?',
      ts: new Date(),
    }])
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col h-dvh">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Bot size={16} className="text-primary" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Assistente IA <Sparkles size={12} className="text-primary" />
            </div>
            <div className="text-[10px] text-green-400 font-semibold">● Online · GPT-4o</div>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        <div className="flex flex-col gap-4 py-2">
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions (only show at start) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
          {SUGGESTIONS.slice(0, 3).map(s => (
            <button key={s} onClick={() => send(s)}
              className="flex-shrink-0 text-[11px] bg-card border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary transition-colors max-w-[200px] truncate">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2 flex-shrink-0 border-t border-border bg-background">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pergunte sobre suas finanças…"
            rows={1}
            style={{ resize: 'none', maxHeight: 120 }}
            className="flex-1 bg-muted border border-border rounded-2xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary leading-relaxed"
            onInput={e => {
              const t = e.currentTarget
              t.style.height = 'auto'
              t.style.height = `${Math.min(t.scrollHeight, 120)}px`
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Enter para enviar · Shift+Enter para nova linha
        </div>
      </div>
    </div>
  )
}
