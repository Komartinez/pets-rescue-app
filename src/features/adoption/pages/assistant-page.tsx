import { useState, type FormEvent } from 'react'

import { getSupabaseClient } from '../../../lib/supabase/client'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: 'I can answer questions using the rescue team’s verified animal information. I cannot diagnose medical issues or guarantee an adoption decision.' }])
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    const content = question.trim()
    if (!content || busy) return
    setQuestion('')
    setError(null)
    const nextMessages = [...messages, { role: 'user' as const, content }]
    setMessages(nextMessages)
    setBusy(true)
    try {
      const { data, error: invokeError } = await getSupabaseClient().functions.invoke<{ answer: string }>('animal-assistant', { body: { messages: nextMessages } })
      if (invokeError) throw invokeError
      setMessages((current) => [...current, { role: 'assistant', content: data?.answer ?? 'Please contact the rescue team for help with that question.' }])
    } catch { setError('The assistant is not available right now. Please contact the rescue team directly.') } finally { setBusy(false) }
  }

  return <section className="content-section narrow-section"><span className="eyebrow">Verified animal information</span><h1>Ask the rescue assistant.</h1><p className="lead">Ask about feeding, exercise, temperament, preparation, or the adoption process. When a record is incomplete, the assistant will say so.</p><div className="chat-panel" aria-live="polite">{messages.map((message, index) => <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><strong>{message.role === 'assistant' ? 'Rescue assistant' : 'You'}</strong>{message.content}</p>)}</div><form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="assistant-question">Your question</label><textarea id="assistant-question" rows={3} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="For example: What should I prepare before bringing a dog home?" /><button className="button button-primary" disabled={busy}>{busy ? 'Checking verified records…' : 'Ask question'}</button></form>{error && <p className="form-error" role="alert">{error}</p>}</section>
}
