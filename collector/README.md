# Collector - Local Agent for Network Discovery & SSH Access

Go-based lightweight collector deployed locally at each client site. Establishes secure VPN tunnel to SaaS platform and provides SSH-Keyless access to network equipment.

## Features

- 🔐 **VPN WireGuard** - Automatic tunnel establishment via token-based enrollment
- 🔑 **SSH Keyless** - Auto-generated SSH keys deployed to equipment
- 🔍 **Auto-Discovery** - SNMP/LLDP/CDP scanning
- 🏗️ **Zero Config** - Binary + token = instant deployment
- 📊 **Real-time Metrics** - Equipment status and performance telemetry

## Architecture

```
Collector (Go/Rust)
├── VPN Module (WireGuard setup)
├── SSH Module (Key management + command execution)
├── Discovery Module (SNMP/LLDP/CDP)
├── Agent Module (Windows/Linux subprocess communication)
└── Uplink (Secure connection back to SaaS)
```

## Build & Deploy

```bash
# Build binary
go build -o collector .

# Deploy on-site with enrollment token
./collector --token <enrollment_token> --site <site_id>
```

## Configuration Files

- `vpn.go` - WireGuard tunnel setup
- `ssh.go` - SSH Keyless operations
- `discovery.go` - Network scanning
- `main.go` - Entry point