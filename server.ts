import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // WinGo Live API proxy
  app.get('/api/wingo', async (req, res) => {
    try {
      const pageNo = req.query.pageNo || 1;
      const targetUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=${pageNo}&t=${Date.now()}`;
      const response = await fetch(targetUrl, {
        headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Upstream WinGo API error' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(502).json({ error: 'Failed to fetch WinGo data', message: error?.message });
    }
  });

  // 1000 Draws Live API proxy
  app.get('/api/wingo-1000', async (_req, res) => {
    try {
      const targetUrl = `https://sky-predictor-1012593186417.asia-southeast1.run.app/api/wingo-history-1m-1000?t=${Date.now()}`;
      const response = await fetch(targetUrl, {
        headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Upstream 1k API error' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(502).json({ error: 'Failed to fetch 1000 draws data', message: error?.message });
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'ADVANCE VIP Engine' });
  });

  // In production, serve the built SPA dist
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // In dev, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ADVANCE Server running on http://localhost:${PORT}`);
  });
}

startServer();
