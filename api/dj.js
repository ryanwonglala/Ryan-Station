// Ryan's Station — AI DJ 无服务代理
// 站长的 DeepSeek key 放 Vercel 环境变量 DEEPSEEK_API_KEY，访客零配置可用。
// 简易限流：单实例内存桶，每 IP 每分钟 8 次（尽力而为，防误刷不防攻击）。

const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 60000;
  const list = (hits.get(ip) || []).filter((t) => t > windowStart);
  if (list.length >= 8) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'no-server-key' });
    return;
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests — the DJ needs a breather.' });
    return;
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 24) {
    res.status(400).json({ error: 'Bad messages payload' });
    return;
  }
  const clean = messages.map((m) => ({
    role: ['system', 'user', 'assistant'].includes(m.role) ? m.role : 'user',
    content: String(m.content || '').slice(0, 6000),
  }));

  try {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: clean,
        temperature: 0.8,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      }),
    });
    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(502).json({ error: `DeepSeek ${upstream.status}: ${text.slice(0, 140)}` });
      return;
    }
    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      res.status(502).json({ error: 'Empty response from DeepSeek' });
      return;
    }
    res.status(200).json({ content });
  } catch (err) {
    res.status(502).json({ error: `Upstream failed: ${err.message}` });
  }
}
