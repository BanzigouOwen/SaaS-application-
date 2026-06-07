# 🌐 NetPulse Omni - SaaS Hub Ticketing, Conformité & Supervision

**Plateforme unifiée pour la gestion des incidents réseau, ticketing avancé, conformité contractuelle et supervision automatisée.**

## 📋 Vue d'Ensemble

NetPulse Omni est une solution SaaS enterprise qui unifie :
- **Ticketing Avancé** : Gestion des incidents et demandes avec champs dynamiques par métier
- **Supervision Réseau** : Auto-discovery, diagrammes topologiques temps réel, KPIs
- **Sécurité Zéro Config** : VPN inverse (WireGuard), SSH Keyless, enrôlement automatique
- **Automatisation Complète** : Playbooks contractuels, self-healing, escalade intelligente
- **Dashboards Personnalisés** : Widgets low-code, requêtes visuelles sans SQL

## 🏗️ Architecture Générale

```
┌─────────────────────────┐
│   Plateforme SaaS       │
│   (Web Frontend +       │
│    Backend APIs)        │
└────────────┬────────────┘
             │
      ┌──────▼──────┐
      │  VPN Tunnel │ (WireGuard / HTTPS)
      └──────┬──────┘
             │
    ┌────────▼────────┐
    │ Collecteur Local │ (Go/Rust)
    │ - SSH Keyless    │
    │ - SNMP Scan      │
    │ - LLDP/CDP Read  │
    └────────┬─────────┘
             │
    ┌────────▼────────────┐
    │  Équipements Client  │
    │ - Switchs (Aruba)    │
    │ - Firewalls (Fortinet)
    │ - Serveurs           │
    └──────────────────────┘
```

## 📁 Structure du Projet

```
SaaS-application-/
├── docs/                          # Documentation technique
│   ├── CDC.md                     # Cahier des charges complet
│   ├── ARCHITECTURE.md            # Diagrammes et flux
│   └── API_SPECS.md               # Spécifications OpenAPI
│
├── backend/                       # Backend API (Node.js/Laravel/FastAPI)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tickets/           # Module ticketing avancé
│   │   │   ├── discovery/         # Module auto-discovery
│   │   │   ├── dashboards/        # Module dashboards & widgets
│   │   │   ├── contracts/         # Moteur de règles contractuelles
│   │   │   ├── automation/        # Engine d'automatisation
│   │   │   └── users/             # Gestion des utilisateurs
│   │   ├── middlewares/           # Auth, tenant isolation
│   │   ├── database/              # Migrations, seeders
│   │   └── config/                # Configuration globale
│   ├── package.json / requirements.txt
│   └── docker-compose.yml
│
├── frontend/                      # Frontend Web (React/Vue)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tickets/           # UI ticketing
│   │   │   ├── Topology/          # Diagrammes réseau
│   │   │   ├── Dashboards/        # Dashboards personnalisés
│   │   │   └── Widgets/           # Composants widgets
│   │   ├── pages/
│   │   ├── services/              # API clients
│   │   └── hooks/                 # Hooks réutilisables
│   └── package.json
│
├── collector/                     # Collecteur Local (Go/Rust)
│   ├── src/
│   │   ├── vpn/                   # Gestion VPN WireGuard
│   │   ├── ssh/                   # SSH Keyless exec
│   │   ├── discovery/             # SNMP, LLDP, ARP scanning
│   │   ├── agent/                 # Agent local (Windows/Linux)
│   │   └── main.go (ou main.rs)
│   ├── Dockerfile
│   └── build.sh
│
├── infrastructure/                # IaC & DevOps
│   ├── terraform/                 # Terraform configs
│   ├── k8s/                       # Manifests Kubernetes
│   └── docker-compose.yml         # Stack locale
│
├── tests/                         # Tests unitaires & intégration
│   ├── backend/
│   ├── frontend/
│   └── collector/
│
└── .github/
    └── workflows/                 # GitHub Actions CI/CD
```

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 14+
- Go 1.20+ (pour le collecteur)

### Installation Locale

```bash
# 1. Cloner le repo
git clone https://github.com/BanzigouOwen/SaaS-application-.git
cd SaaS-application-

# 2. Configuration des variables d'environnement
cp .env.example .env

# 3. Lancer l'infrastructure (DB, Redis, etc.)
docker-compose up -d

# 4. Backend - Migrations DB
cd backend
npm install
npm run db:migrate
npm run dev

# 5. Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev

# 6. Collecteur (après déploiement)
cd collector
go build -o collector .
./collector --token <token_enrollment>
```

## 📚 Modules Clés

### 1️⃣ Ticketing Avancé (`backend/src/modules/tickets/`)
- Gestion parent/enfant de tickets
- Custom fields polymorphiques par tenant
- System de tags et filtrage avancé
- Routing automatique entre groupes/responsables

**Fichier clé** : `backend/src/modules/tickets/models/Ticket.js`

### 2️⃣ Auto-Discovery (`backend/src/modules/discovery/` + `collector/src/discovery/`)
- Scan SNMP automatique
- Lecture LLDP/CDP pour topologie
- Fingerprinting des équipements
- Classification UNI/NNI

### 3️⃣ Moteur de Règles Contractuelles (`backend/src/modules/contracts/`)
- Chargement automatique de playbooks
- Décision : déclenchement immédiat vs attente validation
- Escalade intelligente
- Historique des interventions

### 4️⃣ Dashboards & Widgets (`frontend/src/components/Dashboards/`)
- Query Builder visuel (filtres sans SQL)
- Rendu multi-types (KPI, Chart, DataTable)
- Rafraîchissement temps réel (WebSocket)

### 5️⃣ Collecteur Local (`collector/`)
- Enrôlement auto par token
- VPN WireGuard (tunnel sécurisé)
- SSH Keyless (clés auto-générées)
- Agent Windows/Linux pour diagnostics

## 🔐 Sécurité

- ✅ **VPN Reverse** : Pas d'ouverture de port client
- ✅ **Tenant Isolation** : Séparation stricte des données multi-locataires
- ✅ **SSH Keyless** : Pas de mot de passe stocké
- ✅ **Encryption** : TLS 1.3 + WireGuard
- ✅ **Rate Limiting** : Protection DDoS
- ✅ **Audit Trail** : Logs immuables de toutes les actions

## 📊 Exemples d'Usage

### Créer un Ticket avec Champs Dynamiques (Opérateur Télécom)
```bash
POST /api/v1/tickets/create
{
  "title": "Panne Circuit MPLS",
  "client_type": "telecom",
  "custom_fields": {
    "circuit_ref": "FR-PARIS-001",
    "port_nni": "eth2/1",
    "port_uni": "eth0/24",
    "site_a": "10.0.1.0/24",
    "site_b": "10.0.2.0/24"
  }
}
```

### Query Builder pour Widget Personnalisé
```bash
POST /api/v1/dashboards/widgets/render
{
  "target_table": "tickets",
  "filters": [
    {"field": "status", "operator": "=", "value": "ouvert"},
    {"field": "tag", "operator": "contains", "value": "down"}
  ],
  "render_type": "count",
  "time_range": "7_days"
}
```

## 📖 Documentation

- **[CDC Complet](./docs/CDC.md)** - Spécifications techniques exhaustives
- **[Architecture](./docs/ARCHITECTURE.md)** - Diagrammes flux et décisions
- **[API REST](./docs/API_SPECS.md)** - Endpoints OpenAPI
- **[Guide de Déploiement](./docs/DEPLOYMENT.md)** - Production & K8s

## 🛠️ Technologies

| Couche | Stack |
|--------|-------|
| **Frontend** | React 18 + TypeScript + TailwindCSS |
| **Backend** | Node.js (Express/NestJS) + PostgreSQL |
| **Collecteur** | Go 1.20+ (ou Rust) |
| **VPN** | WireGuard |
| **Temps Réel** | WebSocket + Redis |
| **Container** | Docker + Docker Compose |
| **Orchestration** | Kubernetes (optionnel) |
| **CI/CD** | GitHub Actions |

## 📋 Roadmap

- [ ] Phase 1 : Ticketing de base + DB schema
- [ ] Phase 2 : Auto-discovery + topologie visuelle
- [ ] Phase 3 : Collecteur local + VPN WireGuard
- [ ] Phase 4 : Moteur de règles contractuelles
- [ ] Phase 5 : Dashboards custom + Query Builder
- [ ] Phase 6 : Agent Windows/Linux
- [ ] Phase 7 : Self-healing automatique
- [ ] Phase 8 : Audit & compliance module

## 👥 Contribution

Les contributions sont bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT

## 📧 Support

Pour toute question : support@netpulse-omni.com

---

**Dernière mise à jour** : 7 Juin 2026
