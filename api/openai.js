import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { prompt, userEmail } = req.body

  // Rate limiting - 50 calls per day per user
  if (userEmail) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data } = await supabase
      .from('usage_limits')
      .select('call_count')
      .eq('user_email', userEmail)
      .eq('call_date', today)
      .single()

    if (data && data.call_count >= 50) {
      return res.status(429).json({ error: "Daily limit reached. Try again tomorrow." })
    }

    await supabase.rpc('increment_usage', { 
      p_email: userEmail, 
      p_date: today 
    })
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000
    })
  })

  const data = await response.json()
  res.status(200).json(data)
}