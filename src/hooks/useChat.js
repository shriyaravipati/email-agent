import { useState } from 'react'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userContext, setUserContext] = useState({
    resumeText: null
  })

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userContext })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadResume = async (file) => {
    const formData = new FormData()
    formData.append('resume', file)
    const res = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    setUserContext(prev => ({ ...prev, resumeText: data.text }))
    return data.text
  }

  return { messages, isLoading, sendMessage, uploadResume, userContext }
}