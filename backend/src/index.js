import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { runAutonomousScrape, getLatestInventoryState } from './workers/scraperWorker.js';

const app = express();

// 1. Production-Grade CORS Configuration
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by Senior Security CORS Matrix'));
    }
  }
}));

app.use(express.json());

// 1. Core Monitored Watchlist Array
const WATCHLIST = ['Dell 27 Monitor', 'Sony XM5 Headphones', 'MacBook M3'];

// 2. Automate the Background Daemon Loop (Executes every 15 minutes)
const FIFTEEN_MINUTES = 10 * 60 * 1000;
setInterval(() => {
  runAutonomousScrape(WATCHLIST);
}, FIFTEEN_MINUTES);

// Initial boot ignition run to populate data instantly when server turns on
runAutonomousScrape(WATCHLIST);

// 3. Ultra-Fast Memory Streaming Endpoint
app.get('/api/inventory-monitor', (req, res) => {
  const latestSnapshot = getLatestInventoryState();
  res.status(200).json(latestSnapshot);
});


// 2. Health Check Endpoint for Cloud Providers
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// 3. Defensive Port Binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[System Core] Server securely operating on port ${PORT}`);
});