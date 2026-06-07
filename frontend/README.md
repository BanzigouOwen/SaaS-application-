# Frontend SaaS NetPulse Omni

React-based web interface for ticketing, dashboards, and network topology visualization.

## Technologies

- **React 18** + TypeScript
- **TailwindCSS** for styling
- **Axios** for API calls
- **Cytoscape.js** for network topology graphs
- **Chart.js** for dashboard charts
- **React Query** for state management
- **Socket.io** for real-time updates

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Tickets/          # Ticket creation/detail UI
│   │   ├── Topology/         # Network topology diagram
│   │   ├── Dashboards/       # Dashboard builder
│   │   ├── Widgets/          # Reusable widget components
│   │   └── Auth/             # Login/logout
│   ├── pages/
│   │   ├── TicketsPage.jsx
│   │   ├── TopologyPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/
│   │   ├── api.js            # Axios instance & API calls
│   │   └── websocket.js      # WebSocket connection
│   ├── hooks/
│   │   └── useTickets.js     # Custom React hooks
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── Dockerfile
```

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000
```