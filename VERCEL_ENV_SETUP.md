# Variáveis de Ambiente — Vercel

Acesse: vercel.com → projeto waiter-final → Settings → Environment Variables

## Adicionar as seguintes variáveis:

| Key | Value |
|-----|-------|
| `BREVO_USER` | `ricardo.rogerios@hotmail.com` |
| `BREVO_PASS` | sua senha SMTP do Brevo |

## Como obter a senha SMTP do Brevo:

1. Acesse brevo.com e faça login
2. Vá em **SMTP & API** no menu
3. Copie a chave SMTP (começa com `xkeysib-...`)
4. Cole como valor de `BREVO_PASS`

## Após adicionar as variáveis:

1. Vá em **Deployments**
2. Clique nos 3 pontinhos do deploy mais recente
3. Clique **Redeploy**

Os emails passarão a funcionar automaticamente após o redeploy.
