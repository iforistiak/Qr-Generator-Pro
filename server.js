import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distDir = path.join(__dirname, 'dist');
const distIndex = path.join(distDir, 'index.html');
const rootIndex = path.join(__dirname, 'index.html');

// Serve static assets from dist
app.use(express.static(distDir));

// Health check endpoint for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// SPA fallback to index.html with graceful existence checking
app.get('*', (req, res) => {
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else if (fs.existsSync(rootIndex)) {
    res.sendFile(rootIndex);
  } else {
    res.status(200).send('<!doctype html><html><head><title>QR Studio Pro</title></head><body>Loading...</body></html>');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[QR Studio Pro] Production server listening on 0.0.0.0:${PORT}`);
});
