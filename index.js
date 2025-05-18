<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Roblox Servers Dashboard</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #121212;
    color: #eee;
    margin: 0; padding: 1rem;
  }
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  .server-list {
    max-width: 800px;
    margin: 0 auto;
  }
  .server {
    background: #222;
    margin-bottom: 1rem;
    border-radius: 8px;
    padding: 1rem;
  }
  .server-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .server-name {
    font-weight: bold;
    font-size: 1.2rem;
  }
  button {
    background: #0a84ff;
    border: none;
    padding: 0.5rem 1rem;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
  button:hover {
    background: #0066ff;
  }
  .commands-panel {
    margin-top: 1rem;
    display: none;
  }
  textarea {
    width: 100%;
    height: 60px;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    border: none;
    padding: 0.5rem;
    font-family: monospace;
    font-size: 1rem;
  }
  .log {
    background: #111;
    border-radius: 6px;
    padding: 0.5rem;
    max-height: 100px;
    overflow-y: auto;
    font-size: 0.9rem;
    white-space: pre-wrap;
  }
</style>
</head>
<body>
  <h1>Roblox Servers Dashboard</h1>
  <div class="server-list" id="serverList">
    Loading servers...
  </div>

  <script>
    const API_URL = "https://my-private-roblox-backend.onrender.com";
    const API_KEY = "A7d9X2mPf3VzLjK8RtGwQ5BhY";

    async function fetchServers() {
      const res = await fetch(API_URL + "/servers", {
        headers: { authorization: API_KEY }
      });
      if (!res.ok) {
        document.getElementById("serverList").innerText = "Failed to load servers.";
        return;
      }
      const data = await res.json();
      renderServers(data);
    }

    function renderServers(servers) {
      const container = document.getElementById("serverList");
      container.innerHTML = "";
      if (Object.keys(servers).length === 0) {
        container.innerText = "No servers found.";
        return;
      }

      for (const [id, info] of Object.entries(servers)) {
        const div = document.createElement("div");
        div.className = "server";

        div.innerHTML = `
          <div class="server-header">
            <div class="server-name">${id}</div>
            <button onclick="toggleCommandsPanel('${id}')">Commands</button>
          </div>
          <div>Players: ${info.players} / ${info.maxPlayers}</div>
          <div>Runtime: ${Math.floor(info.runtime/60)} min</div>
          <div class="commands-panel" id="panel-${id}">
            <textarea id="cmd-input-${id}" placeholder="Enter command"></textarea>
            <button onclick="sendCommand('${id}')">Send Command</button>
            <div class="log" id="log-${id}"></div>
          </div>
        `;

        container.appendChild(div);
      }
    }

    function toggleCommandsPanel(id) {
      const panel = document.getElementById(`panel-${id}`);
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    }

    async function sendCommand(id) {
      const input = document.getElementById(`cmd-input-${id}`);
      const log = document.getElementById(`log-${id}`);
      const command = input.value.trim();
      if (!command) return;

      try {
        const res = await fetch(`${API_URL}/command/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: API_KEY
          },
          body: JSON.stringify({ command })
        });
        if (res.ok) {
          log.textContent += `> Sent command: ${command}\n`;
          input.value = "";
        } else {
          log.textContent += `> Failed to send command\n`;
        }
      } catch (e) {
        log.textContent += `> Error: ${e.message}\n`;
      }
    }

    fetchServers();
    // Optionally refresh every 10 seconds:
    setInterval(fetchServers, 10000);
  </script>
</body>
</html>
