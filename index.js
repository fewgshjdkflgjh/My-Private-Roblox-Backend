const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY || 'changeme';
const servers = {};

app.use((req, res, next) => {
  if (req.headers.authorization !== API_KEY) return res.sendStatus(403);
  next();
});

app.post('/update', (req, res) => {
  const { id, players, maxPlayers, runtime } = req.body;
  servers[id] = { players, maxPlayers, runtime, lastSeen: Date.now(), commands: [] };
  res.send('OK');
});

app.get('/servers', (req, res) => res.json(servers));

app.get('/commands/:id', (req, res) => {
  const id = req.params.id;
  const cmds = servers[id]?.commands || [];
  servers[id].commands = [];
  res.json(cmds);
});

app.post('/command/:id', (req, res) => {
  const id = req.params.id;
  const { command } = req.body;
  servers[id]?.commands?.push(command);
  res.send('Queued');
});

app.listen(PORT, () => console.log('Backend running on', PORT));
