import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ─────────────────────────────────────────
// STEP 5 — INPUT SANITIZATION
// ─────────────────────────────────────────

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /you\s+are\s+now\s+(a\s+)?(?!raj|podcast)/i,
  /act\s+as\s+(if\s+you\s+are\s+)?(?!raj|podcast)/i,
  /forget\s+(everything|all|your)\s*(you\s+know|instructions|training)?/i,
  /jailbreak/i,
  /pretend\s+(you\s+are|to\s+be)\s+(?!raj|podcast)/i,
  /do\s+anything\s+now/i,
  /DAN\s+mode/i,
  /bypass\s+(your\s+)?(safety|filter|restriction|guideline)/i,
  /override\s+(your\s+)?(instruction|system|prompt)/i,
  /disregard\s+(your\s+)?(previous|prior|all)/i,
  /you\s+have\s+no\s+(restriction|limit|rule|filter)/i,
  /simulate\s+(a\s+)?(?!podcast|interview|episode)/i,
  /roleplay\s+as\s+(?!podcast|host|interviewer)/i,
  /<script.*?>/i,
  /\beval\s*\(/i,
  /javascript:/i,
]

const MAX_PROMPT_LENGTH = 8000 // ~2000 tokens input max

function sanitizeInput(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return { safe: false, reason: 'Invalid or empty prompt' }
  }

  // Length check
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { safe: false, reason: 'Prompt exceeds maximum allowed length' }
  }

  // Injection pattern check
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return { safe: false, reason: 'Prompt contains disallowed content' }
    }
  }

  // Strip null bytes and control characters (keep newlines/tabs)
  const cleaned = prompt
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()

  return { safe: true, cleaned }
}

// ─────────────────────────────────────────
// STEP 6 — COST TRACKING
// GPT-4o-mini: $0.150 / 1M input tokens, $0.600 / 1M output tokens
// ─────────────────────────────────────────

const COST_PER_INPUT_TOKEN  = 0.150 / 1_000_000   // $0.00000015
const COST_PER_OUTPUT_TOKEN = 0.600 / 1_000_000   // $0.00000060

function calculateCost(usage) {
  if (!usage) return { tokens_used: 0, estimated_cost_usd: 0 }

  const inputCost  = (usage.prompt_tokens     || 0) * COST_PER_INPUT_TOKEN
  const outputCost = (usage.completion_tokens || 0) * COST_PER_OUTPUT_TOKEN

  return {
    tokens_used:         usage.total_tokens || 0,
    prompt_tokens:       usage.prompt_tokens || 0,
    completion_tokens:   usage.completion_tokens || 0,
    estimated_cost_usd:  parseFloat((inputCost + outputCost).toFixed(8))
  }
}

// ─────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, userEmail, feature } = req.body

  // — Sanitize input first —
  const sanitized = sanitizeInput(prompt)

  if (!sanitized.safe) {
    // Log blocked request
    await supabase.from('request_logs').insert({
      user_email:  userEmail  || 'anonymous',
      feature:     feature    || 'unknown',
      status:      'blocked',
      tokens_used: 0,
      estimated_cost_usd: 0,
      blocked_reason: sanitized.reason
    })
    return res.status(400).json({ error: `Request blocked: ${sanitized.reason}` })
  }

  // — Rate limiting —
  if (userEmail) {
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('usage_limits')
      .select('call_count')
      .eq('user_email', userEmail)
      .eq('call_date', today)
      .single()

    if (data && data.call_count >= 50) {
      await supabase.from('request_logs').insert({
        user_email:  userEmail,
        feature:     feature || 'unknown',
        status:      'rate_limited',
        tokens_used: 0,
        estimated_cost_usd: 0
      })
      return res.status(429).json({ error: 'Daily limit reached. Try again tomorrow.' })
    }

    await supabase.rpc('increment_usage', { p_email: userEmail, p_date: today })
  }

  // — OpenAI call —
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:      'gpt-4o-mini',
        messages:   [{ role: 'user', content: sanitized.cleaned }],
        max_tokens: 3000
      })
    })

    const data = await response.json()

    // — Calculate cost from real token usage —
    const costData = calculateCost(data.usage)

    // — Log success with cost —
    await supabase.from('request_logs').insert({
      user_email:          userEmail || 'anonymous',
      feature:             feature   || 'unknown',
      status:              'success',
      tokens_used:         costData.tokens_used,
      prompt_tokens:       costData.prompt_tokens,
      completion_tokens:   costData.completion_tokens,
      estimated_cost_usd:  costData.estimated_cost_usd
    })

    res.status(200).json(data)

  } catch (error) {
    await supabase.from('request_logs').insert({
      user_email:          userEmail || 'anonymous',
      feature:             feature   || 'unknown',
      status:              'error',
      tokens_used:         0,
      estimated_cost_usd:  0
    })
    res.status(500).json({ error: 'Something went wrong' })
  }
}