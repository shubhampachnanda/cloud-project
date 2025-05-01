const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const metricsApp = express();  // 🧠 Separate server for metrics!

const PORT = 3000;
const METRICS_PORT = 3001;     // 🧠 Different port for metrics
const TGI_URL = 'http://127.0.0.1:30080';

const tenantPromptCounts = {};

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'] || 'unknown';
  const promptInput = req.body.inputs;

  tenantPromptCounts[tenantId] = (tenantPromptCounts[tenantId] || 0) + 1;
  console.log(`[Request] Tenant=${tenantId} | Total Prompts=${tenantPromptCounts[tenantId]}`);

  try {
    const response = await axios.post(`${TGI_URL}/generate`, {
      inputs: promptInput
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('[Proxy Error]', error.message);
    res.status(500).json({ error: 'Error forwarding to TGI', message: error.message });
  }
});

// 🧠 Metrics server separately
metricsApp.get('/metrics', (req, res) => {
  let metrics = '# HELP tenant_prompts_total Number of prompts per tenant\n';
  metrics += '# TYPE tenant_prompts_total counter\n';

  for (const [tenant, count] of Object.entries(tenantPromptCounts)) {
    metrics += `tenant_prompts_total{tenant="${tenant}"} ${count}\n`;
  }

  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

// Main app listens on 3000
app.listen(PORT, () => {
  console.log(`🟢 Proxy server (frontend) listening on http://localhost:${PORT}`);
});

// Metrics app listens on 3001
metricsApp.listen(METRICS_PORT, () => {
  console.log(`📈 Metrics server listening on http://localhost:${METRICS_PORT}/metrics`);
});
