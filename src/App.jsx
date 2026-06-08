import { useState, useRef, useEffect } from 'react'
import { useChat } from './hooks/useChat'
import EmailPreviewCard from './components/EmailPreviewCard'

function renderMessage(content) {
  const emailMatch = content.match(/<email>([\s\S]*?)<\/email>/)
  if (emailMatch) {
    const before = content.slice(0, content.indexOf('<email>')).trim()
    return (
      <div>
        {before && <p style={{ marginBottom: 8, margin: '0 0 8px 0' }}>{before}</p>}
        <EmailPreviewCard text={emailMatch[1].trim()} />
      </div>
    )
  }
  return <p style={{ margin: 0, lineHeight: 1.7 }}>{content}</p>
}

export default function App() {
  const { messages, isLoading, sendMessage, uploadResume, userContext } = useChat()
  const [input, setInput] = useState('')
  const fileRef = useRef()
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await uploadResume(file)
    sendMessage('I just uploaded my resume. Use it to personalize any emails you write for me.')
    e.target.value = ''
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: 720,
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#1f2937'
    }}>

      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 600,
        fontSize: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Email Agent</span>
        {userContext.resumeText && (
          <span style={{ fontSize: 12, color: '#10b981', fontWeight: 400 }}>
            ✓ Resume loaded
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: 80, fontSize: 15 }}>
            Tell me who you want to email and what you're looking for.
            <br />
            <span style={{ fontSize: 13 }}>You can also upload your resume using the button below.</span>
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: 12,
              background: m.role === 'user' ? '#1d1d1f' : '#f3f4f6',
              color: m.role === 'user' ? 'white' : '#1f2937',
              fontSize: 14
            }}>
              {renderMessage(m.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: '#f3f4f6',
              color: '#9ca3af',
              fontSize: 14
            }}>
              Researching...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-end'
      }}>
        <input
          type="file"
          accept=".pdf"
          ref={fileRef}
          onChange={handleFile}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileRef.current.click()}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: userContext.resumeText ? '#f0fdf4' : 'white',
            cursor: 'pointer',
            fontSize: 13,
            color: userContext.resumeText ? '#10b981' : '#6b7280',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
          {userContext.resumeText ? '✓ Resume' : '+ Resume'}
        </button>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Who do you want to email? Paste their website URL too."
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 14,
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.5
          }}
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            background: '#1d1d1f',
            color: 'white',
            border: 'none',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: 14,
            opacity: isLoading || !input.trim() ? 0.4 : 1,
            flexShrink: 0
          }}>
          Send
        </button>
      </div>
    </div>
  )
}