import { useState } from 'react'

export default function EmailPreviewCard({ text }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      border: '1px solid #d1d5db',
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      background: '#f9fafb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>
          GENERATED EMAIL
        </span>
        <button onClick={copy} style={{
          fontSize: 12,
          cursor: 'pointer',
          padding: '4px 12px',
          borderRadius: 6,
          border: '1px solid #d1d5db',
          background: 'white',
          color: '#374151'
        }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        whiteSpace: 'pre-wrap',
        fontSize: 14,
        lineHeight: 1.7,
        margin: 0,
        fontFamily: 'inherit',
        color: '#1f2937'
      }}>
        {text}
      </pre>
    </div>
  )
}