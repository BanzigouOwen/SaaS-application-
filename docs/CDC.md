# Cahier des Charges Technique & Fonctionnel - NetPulse Omni

## SAAS "NETPULSE OMNI" : HUB UNIFIÉ TICKETING, CONFORMITÉ & SUPERVISION

---

## MODULE 1 : COMPOSANTS LOCAUX, VPN INVERSE & SÉCURITÉ (ZÉRO CONFIGURATION)

L'accès aux infrastructures se fait sans aucune ouverture de port sur le pare-feu du client final. Le collecteur local initie un flux unique sortant.

```
[Plateforme SaaS (Web)] ──(Via VPN Étanche)──> [Collecteur Local] ──(SSH Keyless)──> [Équipement]
```

### 1.1 Processus d'Enrôlement Automatique par Token

1. **Génération (SaaS)** : Le manager génère un jeton unique temporaire (token_hash) lié à un site_id dans la plateforme.
2. **Installation (Terrain)** : Un binaire léger compilé en **Go** ou **Rust** (le Collecteur) est exécuté sur site avec ce token.
3. **Appairage VPN** : Le collecteur génère ses clés cryptographiques (WireGuard), transmet sa clé publique à l'API SaaS, et reçoit une IP privée dédiée (ex: 10.100.x.x). Le tunnel se monte instantanément via le port UDP 51820 ou encapsulé dans du flux HTTPS (Port TCP 443).
4. **Segmentation Stricte** : Chaque tenant (client) possède son propre sous-réseau VPN. Les collecteurs de deux clients différents sont totalement étanches et ne peuvent pas communiquer entre eux.

### 1.2 Passerelle de Diagnostic et SSH Keyless (Sans mot de passe)

* **Génération de Clé** : Le collecteur génère une paire de clés SSH lors de son premier lancement.
* **Déploiement** : Cette clé publique est poussée une seule fois sur les équipements du site (Switchs Aruba/Huawei/Raisecom, Firewalls Fortinet/Stormshield, serveurs).
* **Exécution à la volée** : Pour lancer une commande (ex: show interface uni), la plateforme envoie l'ordre au collecteur via le VPN. Le collecteur ouvre une session SSH instantanée à l'aide de sa clé privée, exécute la commande, capture la sortie texte, ferme la session et renvoie le résultat au SaaS.

---

## MODULE 2 : AUTO-DISCOVERY & DIAGRAMMES TOPOLOGIQUES DYNAMIQUES

### 2.1 Moteur de Découverte Réseau et Système

* **Scans de Niveau 2 & 3** : Balayage Ping ICMP asynchrone couplé à une lecture intensive de la table ARP du routeur local pour éviter les équipements invisibles.
* **Fingerprinting SNMP** : Interrogation des MIBs standards pour identifier le constructeur via la MIB sysDescr (.1.3.6.1.2.1.1.1.0).
* **Cartographie des Liens** : Lecture automatique des tables de voisinage **LLDP** (1.0.8802.1.1.2) et **CDP** pour comprendre les interconnexions physiques.
* **Sémantique Opérateur** : Identification automatique et labellisation des interfaces selon les standards du marché : **UNI** (User Network Interface, côté LAN client) et **NNI** (Network Node Interface, côté cœur de réseau/opérateur).

### 2.2 Rendu Visuel des Graphes (Diagrammes auto-générés)

* Utilisation d'une bibliothèque de graphes dynamiques (ex: *Cytoscape.js* ou *GoJS*).
* **États en temps réel** : Les lignes reliant les équipements changent de couleur selon la supervision (Vert = OK, Orange = Latence/saturation, Rouge clignotant = Coupure/Down). Un clic sur un élément en rouge ouvre immédiatement le ticket d'incident associé.

---

## MODULE 3 : MOTEUR DE TICKETING AVANCÉ (CORE LOGIC)

Le système doit gérer de manière native et distincte les **Incidents** (rupture de service) et les **Demandes** (requêtes de changement, ajouts de droits).

### 3.1 Structure et Cycle de Vie du Ticket

* **Relation Parent / Enfant** : Possibilité de lier plusieurs tickets enfants à un "Ticket Parent". *Exemple : Si un Backbone opérateur tombe, 50 tickets de sites clients (enfants) sont rattachés au ticket de panne de l'infrastructure principale. Clôturer le parent clôture automatiquement les enfants.*
* **Système de Tags Polymorphiques** : Possibilité d'ajouter des étiquettes personnalisables (ex: #Urgent, #Lien_Secours, #VIP) pour filtrer, trier et déclencher des automatisations.
* **Matrice d'Escalade & Routage** :
  * **Changement de groupe** : Migration transparente du ticket entre les équipes (Support N1 → Ingénierie N2 → Expertise N3 → Équipe Terrain).
  * **Changement de responsable** : Assignation nominative à un technicien avec historique complet et calcul des temps de détention du ticket pour les statistiques d'efficacité.

### 3.2 Custom Fields Dynamiques par Typologie Client (Métiers)

La plateforme ne doit pas avoir des formulaires figés. Les champs additionnels s'adaptent selon le secteur d'activité du client (Pattern de métadonnées polymorphes en base de données).

* **Exemple Typologie "Opérateur / Télécom"** : Le formulaire de ticket fait apparaître obligatoirement les champs : Réf Circuit (ID), Port NNI, Port UNI, Adresse Site A, Adresse Site B.
* **Exemple Typologie "Retail / Grande Distribution"** : Le formulaire de ticket affiche uniquement : N° de Caisse, Équipement Down (TPE, Balance, PC Caisse), Nom du Responsable Magasin.

```
[Création de Ticket]
         │
         ├── Clic Client Opérateur ───> Charge Champs : [Site A] [Site B] [VLAN]
         │
         └── Clic Client Retail ──────> Charge Champs : [N° Caisse] [Équipement Down]
```

### 3.3 Moteur de Règles Contractuelles (Playbooks d'Astreinte)

Dès qu'un incident est créé (manuellement ou par la supervision), le système charge instantanément les consignes du contrat de ce client spécifique.

* **Mode Action Immédiate** : Le ticket déclenche instantanément une alerte d'astreinte, envoie un SMS au technicien N2 et ouvre un ticket de niveau critique chez l'opérateur tiers.
* **Mode Temporisé / Validation** : Le système met le ticket en statut En attente confirmation client. Une notification interactive (Email/SMS avec bouton) est envoyée au contact du client : *"Un incident a été détecté sur votre TPE de caisse n°3, confirmez-vous le déclenchement de l'intervention de production ?"*. Si le client clique sur "Oui", le processus d'escalade démarre.

---

## MODULE 4 : LE HUB D'AUTOMATISATION (CONVERGENCE TOTAL)

L'interconnexion absolue entre la supervision et le ticketing élimine les tâches manuelles de la production informatique.

### 4.1 Auto-Enrichissement & Auto-Résolution (Self-Healing)

1. **Alerte** : Le collecteur détecte via l'agent Windows qu'un service critique (ex: Spouleur d'impression) est arrêté.
2. **Création & Diagnostic** : Le SaaS ouvre le ticket, ordonne à l'agent de lancer un pré-diagnostic et d'injecter la capture de log dans le ticket.
3. **Remédiation** : L'agent tente de redémarrer le service à 3 reprises.
4. **Clôture** : Si le service redémarre, la supervision passe au vert, le ticket est clôturé automatiquement avec la mention : [RÉSOLUTION AUTOMATIQUE PAR LE SYSTÈME]. Le technicien humain n'a rien eu à faire.

---

## MODULE 5 : ENGINE DE DASHBOARD & WIDGETS CUSTOM (LOW-CODE)

Chaque utilisateur (Manager ESN, Tech N1, Directeur Client) doit pouvoir bâtir son propre tableau de bord à l'aide d'un constructeur de requêtes visuel.

### 5.1 Architecture des Widgets

Un widget est défini par trois éléments en base de données : un **Filtre (Query)**, un **Type de Rendu**, et une **Périodicité**.

* **Le Query Builder Visuel (Filtres)** : Permet de requêter la base sans écrire de SQL.
  * *Exemple de filtres cumulables* : where tenant_id = X AND status = 'ouvert' AND created_at >= '7_days_ago' AND tags CONTAINS '#FTTO'.
* **Les Types de Rendu Visuel** :
  1. **Le Chiffre Unique (KPI)** : Affiche une statistique massive (ex: *"Temps moyen de résolution actuel : 42 min"*).
  2. **Le Graphique (Charts)** : Histogrammes, courbes de tendance, camemberts (ex: Répartition des pannes par constructeur : 40% Aruba, 30% Huawei, 30% Raisecom).
  3. **La Liste Dynamique (Datatable)** : Un tableau filtré en temps réel montrant les 10 derniers incidents réseaux affectant les interfaces NNI.

---

## MODULE 6 : PROMPTS CLÉS EN MAIN POUR VOS ASSISTANTS IA

### PROMPT 1 : Base de données du Ticketing Avancé (Modèle Récursif + Custom Fields)

> *"Agis comme un architecte de base de données B2B senior. Génère le script SQL ou les migrations ORM pour la gestion des tickets.*
> *1. Crée une table tickets contenant id (UUID), tenant_id, parent_id (nullable, foreign key sur elle-même pour la gestion parent/enfant), title, status (enum: ouvert, en_cours, attente_client, resolu), assigned_group_id, assigned_user_id.*
> *2. Crée une table tags et une table pivot ticket_tag.*
> *3. Crée une table custom_fields (id, tenant_id, field_name, field_type) et une table ticket_custom_values (id, ticket_id, custom_field_id, value) pour stocker de façon polymorphique les données spécifiques (ex: Site A/Site B pour les opérateurs, ou N° Caisse pour le retail)."*

### PROMPT 2 : Algorithme d'Astreinte et Logique Contractuelle (Backend)

> *"Rédige une fonction de traitement d'incident en Backend (Node.js ou Laravel). Lorsqu'un ticket est créé, la fonction doit aller lire la configuration contractuelle du client (tenant_id). Si le contrat spécifie 'DECLENCHEMENT_IMMEDIAT', le système change le statut en 'Astreinte_Active' et émet un événement d'alerte SMS/Pager. Si le contrat spécifie 'ATTENTE_CONFIRMATION', le système bloque le ticket au statut 'En_Attente_Validation', génère un token d'approbation unique et envoie un email interactif au client pour valider le déclenchement."*

### PROMPT 3 : Moteur de Requêtes pour Widgets Personnalisés (API)

> *"Rédige un contrôleur d'API (en Python/FastAPI ou PHP/Laravel) appelé POST /api/v1/dashboards/widgets/render. Ce endpoint reçoit un payload JSON décrivant les filtres d'un widget personnalisé, par exemple : {'target_table': 'tickets', 'filters': [{'field': 'status', 'operator': '=', 'value': 'ouvert'}, {'field': 'tag', 'operator': 'contains', 'value': 'down'}], 'render_type': 'count'}. La fonction doit sécuriser la requête en injectant obligatoirement le scoping du tenant_id de l'utilisateur connecté pour empêcher toute fuite de données, exécuter la requête dynamiquement sur la base de données, et retourner le résultat au format attendu pour le composant graphique (générer le décompte ou les données de séries temporelles pour un graphique)."*

---

**Fin du Cahier des Charges**
