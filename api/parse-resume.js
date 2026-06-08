export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const chunks = []
  req.on('data', chunk => chunks.push(chunk))
  req.on('end', async () => {
    try {
      const buffer = Buffer.concat(chunks)
      const boundary = req.headers['content-type'].split('boundary=')[1]
      const bodyStr = buffer.toString('binary')
      const parts = bodyStr.split('--' + boundary)
      const filePart = parts.find(p => p.includes('filename='))

      if (!filePart) return res.status(400).json({ error: 'No file found' })

      const fileStart = filePart.indexOf('\r\n\r\n') + 4
      const fileEnd = filePart.lastIndexOf('\r\n')
      const fileBuffer = Buffer.from(filePart.slice(fileStart, fileEnd), 'binary')

      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default
      const data = await pdfParse(fileBuffer)
      res.status(200).json({ text: data.text })
    } catch (err) {
      res.status(500).json({ error: 'Failed to parse resume: ' + err.message })
    }
  })
}