# NetPulse Omni - GitHub Issues Roadmap

## 🚀 8-Phase Development Roadmap

---

## Phase 1: Core Ticketing System - Database Schema & Models
**Status**: 🟡 Ready to Start  
**Priority**: 🔴 CRITICAL  
**Estimation**: 20-26 hours  

### Description
Impémenter le système de ticketing de base avec support parent/enfant, tags polymorphes et custom fields dynamiques.

### Tasks
- [ ] Finaliser les migrations Knex (tickets, tags, custom_fields tables)
- [ ] Implémenter TicketRepository avec CRUD operations
- [ ] Implémenter TagRepository et pivot table logic
- [ ] Tester les relations parent/enfant (récursive)
- [ ] Implémenter les validations de custom fields
- [ ] Créer les seeders pour données de test
- [ ] Implémenter les commentaires et timeline
- [ ] Ajouter les tests unitaires

### Acceptance Criteria
- ✅ POST /api/v1/tickets crée un ticket avec custom fields
- ✅ GET /api/v1/tickets/:id retourne le ticket avec history
- ✅ Parent ticket peut avoir 50+ enfants
- ✅ Clôture du parent clôture automatiquement les enfants
- ✅ Tags peuvent être associés/dissociés dynamiquement
- ✅ Custom fields s'adaptent au tenant_id et client_type

### Dependencies
Aucune (Phase 1 isolée)

### Labels
`backend` `ticketing` `phase-1` `priority:critical`

---

## Phase 2: Auto-Discovery & Network Topology Scanning
**Status**: 🟡 Ready to Start (après Phase 1)  
**Priority**: 🔴 CRITICAL  
**Estimation**: 28-36 hours  

### Description
Impémenter le moteur de découverte réseau automatique (SNMP, LLDP, CDP) et les diagrammes topologiques dynamiques.

### Tasks
- [ ] Implémenter discovery.go (SNMP MIB queries)
- [ ] Implémenter LLDP neighbor discovery (MIB 1.0.8802.1.1.2)
- [ ] Implémenter CDP scanning
- [ ] Créer le modèle Equipment + TopologyLink en DB
- [ ] Implémenter POST /api/v1/discovery/scan endpoint
- [ ] Implémenter GET /api/v1/discovery/topology endpoint
- [ ] Créer le frontend Topology component (Cytoscape.js)
- [ ] Implémenter l'identification UNI/NNI automatique

### Acceptance Criteria
- ✅ Scanner détecte 50+ équipements sur un subnet /24
- ✅ Identification automatique UNI/NNI interfaces
- ✅ Diagramme visuel affichable en temps réel
- ✅ Couleur des liens change (Vert=OK, Orange=Saturation, Rouge=Down)
- ✅ Fingerprinting manufacturer par sysDescr
- ✅ Performance: scan < 5 min pour subnet /24

### Dependencies
Phase 1 (ticketing base)

### Labels
`backend` `discovery` `frontend` `phase-2` `priority:critical`

---

## Phase 3: Collector Local Agent - VPN + SSH Keyless
**Status**: 🟡 Ready to Start (après Phase 2)  
**Priority**: 🔴 CRITICAL  
**Estimation**: 32-40 hours  

### Description
Déployer le collecteur local (Go) avec VPN WireGuard et SSH keyless pour accès sans mot de passe aux équipements.

### Tasks
- [ ] Implémenter vpn.go (WireGuard setup + key generation)
- [ ] Implémenter enrollment par token temporaire
- [ ] Implémenter ssh.go (keypair generation + deployment)
- [ ] Implémenter keyless SSH command execution
- [ ] Créer endpoint API POST /api/v1/collectors/enroll
- [ ] Implémenter token expiry et revocation logic
- [ ] Tester déploiement avec Dockerfile collector
- [ ] Implémenter heartbeat et health checks

### Acceptance Criteria
- ✅ Collecteur enrôle avec token en < 30 secondes
- ✅ VPN tunnel établi et stable
- ✅ SSH keys déployées automatiquement sur équipements
- ✅ Commande SSH exécutée sans mot de passe
- ✅ Multi-tenant isolation stricte (VPN subnet isolé)
- ✅ Token expires en 1 heure
- ✅ Collecteur reconnecte auto après déconnexion

### Dependencies
Phase 2 (discovery) + Backend auth

### Labels
`collector` `vpn` `ssh` `phase-3` `priority:critical`

---

## Phase 4: Contract Engine & Playbook Logic
**Status**: 🟡 Ready to Start (après Phase 1)  
**Priority**: 🔴 CRITICAL  
**Estimation**: 28-36 hours  

### Description
Impémenter le moteur de règles contractuelles pour escalade d'incidents (mode immédiat vs validation).

### Tasks
- [ ] Créer tables Contract + ContractPlaybook en DB
- [ ] Implémenter ContractEngine.processNewTicket()
- [ ] Mode IMMEDIATE: Escalade SMS + External ticket creation
- [ ] Mode VALIDATION: Attente confirmation client + approval token
- [ ] Implémenter SMS sending (Twilio integration)
- [ ] Créer endpoint POST /api/v1/tickets/:id/approve
- [ ] Implémenter approval token avec TTL (30 min)
- [ ] Créer le template email/SMS interactif
- [ ] Logger toutes les actions contractuelles

### Acceptance Criteria
- ✅ Ticket critique déclenche escalade immédiate
- ✅ Ticket retail attend confirmation client
- ✅ SMS reçu par On-Call engineer < 2 secondes
- ✅ Token d'approbation expires en 30 min
- ✅ Client reçoit email+SMS avec boutons OUI/NON
- ✅ Audit trail trace toutes les décisions

### Dependencies
Phase 1 (ticketing) + Auth Backend

### Labels
`backend` `contracts` `automation` `phase-4` `priority:critical`

---

## Phase 5: Dashboard Builder & Widget Engine (Low-Code)
**Status**: 🟡 Ready to Start (après Phase 1)  
**Priority**: 🟠 HIGH  
**Estimation**: 32-40 hours  

### Description
Impémenter le constructeur de dashboards personnalisés avec query builder visuel et widgets polymorphes.

### Tasks
- [ ] Implémenter WidgetRenderer avec sanitization des filtres
- [ ] Créer Query Builder visuel (frontend Drag&Drop)
- [ ] Implémenter rendu KPI (chiffre unique avec trending)
- [ ] Implémenter rendu Charts (histogrammes, camemberts, courbes)
- [ ] Implémenter rendu DataTable (liste dynamique avec pagination)
- [ ] Implémenter sauvegarde dashboard DB
- [ ] Créer endpoint POST /api/v1/dashboards/widgets/render
- [ ] Implémenter WebSocket pour rafraîchissement temps réel
- [ ] Tester prévention SQL injection

### Acceptance Criteria
- ✅ User crée widget sans écrire SQL
- ✅ Filtres cumulables: status=ouvert AND tag CONTAINS 'down'
- ✅ Rafraîchissement en temps réel (WebSocket)
- ✅ Isolation stricte par tenant (pas de fuite de données)
- ✅ Performance: widget render < 500ms
- ✅ Support 50+ combinaisons de filtres

### Dependencies
Phase 1 (ticketing) + Frontend

### Labels
`frontend` `backend` `dashboards` `phase-5` `priority:high`

---

## Phase 6: Windows/Linux Agent & Self-Healing Automation
**Status**: 🟡 Ready to Start (après Phase 1)  
**Priority**: 🟠 HIGH  
**Estimation**: 32-40 hours  

### Description
Déployer les agents Windows/Linux pour auto-diagnostic et auto-résolution des services (self-healing).

### Tasks
- [ ] Implémenter agent Windows (Go binary ou PowerShell wrapper)
- [ ] Implémenter agent Linux (Go binary + systemd integration)
- [ ] Détection de service arrêté (Service Down detection)
- [ ] Tentatives de redémarrage avec retry logic (3x avec backoff)
- [ ] Capture des logs pour injection dans ticket
- [ ] Auto-résolution si service redémarre
- [ ] Créer ticket automatiquement si echec remédiation
- [ ] Implémenter heartbeat et monitoring agents

### Acceptance Criteria
- ✅ Service DOWN → Ticket créé en < 5 secondes
- ✅ Auto-redémarrage réussit → Ticket clôturé automatiquement
- ✅ Auto-redémarrage échoue → Ticket N1 assigné avec priorité
- ✅ Logs injectés et consultables dans ticket comment
- ✅ Support Windows Server 2019+ et Linux (RHEL, Ubuntu)
- ✅ Zero downtime agent updates

### Dependencies
Phase 1 (ticketing) + Collector

### Labels
`agent` `automation` `phase-6` `priority:high`

---

## Phase 7: Multi-Tenant Security & Audit Trail
**Status**: 🟡 Ready to Start (après Phase 5)  
**Priority**: 🔴 CRITICAL  
**Estimation**: 28-36 hours  

### Description
Impémenter l'isolation stricte multi-locataires, audit immuable et RBAC (Role-Based Access Control).

### Tasks
- [ ] Middleware tenant isolation obligatoire sur tous les endpoints
- [ ] Implémenter RBAC (admin, tech, manager, customer)
- [ ] Créer table AuditLog pour logging immuable
- [ ] Logger toutes les actions (create, update, delete, view)
- [ ] Implémenter permission checks par role et par ressource
- [ ] Implémenter data scoping automatique par tenant
- [ ] Tester data leakage prevention (suite de tests)
- [ ] Créer endpoint GET /api/v1/audit/logs avec filtres
- [ ] Implémenter encryption de données sensibles

### Acceptance Criteria
- ✅ User A ne peut pas voir data de User B (même tenant)
- ✅ Tenant X ne peut pas accéder data Tenant Y
- ✅ Toutes les actions loggées en audit trail
- ✅ Deletion complètement traçable
- ✅ Permission denied retourne 403 (pas 200 avec data vide)
- ✅ Support signatures numériques sur audit logs

### Dependencies
Phase 1-5 (tous les modules précédents)

### Labels
`security` `audit` `rbac` `phase-7` `priority:critical`

---

## Phase 8: CI/CD Pipeline & Production Deployment
**Status**: 🟡 Ready to Start (après Phase 7)  
**Priority**: 🟠 HIGH  
**Estimation**: 26-34 hours  

### Description
Configurer GitHub Actions pour tests, build et déploiement automatisé en Kubernetes.

### Tasks
- [ ] Créer GitHub Actions workflow pour tests backend (Jest)
- [ ] Créer GitHub Actions workflow pour tests frontend (Vitest)
- [ ] Linter + code quality checks (ESLint, golangci-lint)
- [ ] SAST: Sonarqube ou Snyk integration
- [ ] Build Docker images (backend, frontend, collector)
- [ ] Push images vers Docker Hub/GitHub Packages
- [ ] Créer K8s manifests (Deployment, Service, Ingress, ConfigMap)
- [ ] Setup CD pour déploiement staging/production
- [ ] Implémenter health checks (readiness/liveness probes)
- [ ] Implémenter rollback automatique si health check fail
- [ ] Database migrations automatiques (Liquibase/Flyway)
- [ ] Secrets management (Sealed Secrets ou External Secrets)

### Acceptance Criteria
- ✅ Push to main → Tests → Build → Deploy staging
- ✅ Tag release (v1.0.0) → Deploy production
- ✅ Health checks vérifiés avant deploy (< 5 min)
- ✅ Rollback auto si health check fail
- ✅ Zero-downtime deployments (rolling updates)
- ✅ Database migrations rollback capability
- ✅ Logs centralisés et consultables

### Dependencies
Tous les phases (1-7)

### Labels
`devops` `ci-cd` `kubernetes` `phase-8` `priority:high`

---

## 📊 Timeline Global

```
Phase 1: ████░░░░░░ (20-26h)  → 1-2 semaines
Phase 2: ██████░░░░ (28-36h)  → 2-3 semaines
Phase 3: ███████░░░ (32-40h)  → 2-3 semaines
Phase 4: ██████░░░░ (28-36h)  → 2-3 semaines
Phase 5: ███████░░░ (32-40h)  → 2-3 semaines
Phase 6: ███████░░░ (32-40h)  → 2-3 semaines
Phase 7: ██████░░░░ (28-36h)  → 2-3 semaines
Phase 8: █████░░░░░ (26-34h)  → 2-3 semaines

TOTAL: ~226-288 heures de développement
Estimation: 2-3 mois pour équipe de 2-3 développeurs fullstack
```

---

## 🏆 Success Metrics

- ✅ Tous les tests unitaires passent (coverage > 80%)
- ✅ Aucune fuite de données multi-tenant
- ✅ Performance: API < 200ms, Frontend < 500ms
- ✅ Uptime 99.9% en production
- ✅ Support de 1000+ tickets/jour
- ✅ Zero-downtime deployments automatiques
- ✅ Conformité ISO 27001 + SOC2 Type II

---

## 📞 Support & Questions

Pour plus de détails sur une phase spécifique, consultez le CDC complet: [docs/CDC.md](../docs/CDC.md)
