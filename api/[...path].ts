import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM_BASE = 'https://pvz-2-api.vercel.app/api';

export default async function handler(req: VercelRequest, res: VercelResponse) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path } = req.query;
    const pathStr = Array.isArray(path) ? path.join('/') : (path || '');

    const url = `${UPSTREAM_BASE}/${pathStr}`;

    const upstreamRes = await fetch(url, {
      method: req.method,
    });

    const text = await upstreamRes.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return res.status(upstreamRes.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Erro ao consultar API upstream.' });
  }
}
