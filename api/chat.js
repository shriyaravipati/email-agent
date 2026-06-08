const Anthropic = require('@anthropic-ai/sdk')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages, userContext } = req.body

  const systemPrompt = `
You are a personalized cold email agent helping college students reach out to
professors, research PIs, and companies.

Your behavior:
1. Collect what you need through natural conversation. Ask one question at a time.
2. When the user gives you a person's name and their website or LinkedIn URL,
   use web_search to research them before writing anything.
3. Write a highly personalized email that references specific details from
   their actual work — never generic flattery.
4. Revise the email based on any follow-up instructions the user gives you.
5. Answer any questions the user has about cold emailing or their situation.

What you need before writing the email:
- Who they are emailing (name + website or LinkedIn URL)
- What opportunity they want (research position, internship, job, etc.)
- Something about the user (background, skills, what they bring)

What you currently know about the user:
${userContext.resumeText
  ? 'Resume:\n' + userContext.resumeText.slice(0, 3000)
  : 'Resume: not uploaded yet'}

Rules for every email you write:
- Open with a specific reference to one real piece of their recent work
- Keep the body under 200 words
- Always include a subject line at the top
- Never use placeholder text like [your name] — write real sentences
- Be warm, direct, and concise

When you produce a finished email, wrap it in <email> tags like this:
<email>
Subject: ...

Dear ...

...
</email>

When the user asks you to change anything, revise it and wrap it in <email> tags again.
`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: systemPrompt,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages
    })

    const reply = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('')

    res.status(200).json({ reply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}