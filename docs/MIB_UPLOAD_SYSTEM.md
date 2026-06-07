# MIB Upload & Dynamic Template System

Système avancé pour charger des MIBs custom et créer des templates réutilisables.

## 🎯 Architecture Concept

```
┌─────────────────────────────────────────────────┐
│         SaaS Platform Frontend                  │
│  1. Upload custom MIB file (*.txt)              │
│  2. Platform parses MIB automatically           │
│  3. Display available fields for user selection │
│  4. Create reusable template                    │
│  5. Apply template to all devices of that type  │
└─────────────┬───────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│   Backend: MIB Parser Service                   │
│  - Extract OIDs, names, types, descriptions     │
│  - Auto-detect OID prefix (vendor fingerprint)  │
│  - Generate JSON template                       │
│  - Store template in database                   │
└─────────────┬───────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│   Collector: Custom Vendor Scanner              │
│  - Load templates at startup                    │
│  - Query devices using selected MIB fields      │
│  - Return normalized data to SaaS               │
└─────────────────────────────────────────────────┘
```

## 📋 Workflow Step-by-Step

### Step 1: Upload MIB File
```bash
POST /api/v1/mib/upload
Content-Type: multipart/form-data

vendor_name: "VendorXYZ"
model_name: "Model-ABC-100"
mib_file: <binary MIB content>
```

### Step 2: Platform Parses MIB
```go
parser := mib.NewMIBParser(mibContent)
objects, _ := parser.Parse()

// Output:
// [
//   {
//     "name": "deviceInfo",
//     "oid": "1.3.6.1.4.1.12345.1.1",
//     "type": "OCTET STRING",
//     "description": "Device model information"
//   },
//   {
//     "name": "cpuUsage",
//     "oid": "1.3.6.1.4.1.12345.2.1",
//     "type": "INTEGER (0..100)",
//     "description": "CPU utilization percentage"
//   },
//   ...
// ]
```

### Step 3: User Selects Fields
```json
POST /api/v1/mib/template/create

{
  "vendor_name": "VendorXYZ",
  "model_name": "Model-ABC-100",
  "selected_fields": [
    "deviceInfo",
    "cpuUsage",
    "memoryUsage"
  ],
  "description": "Monitor CPU, Memory and Device Info"
}
```

### Step 4: Template Created
```json
{
  "template_id": "tpl_xyz_abc_100",
  "vendor_name": "VendorXYZ",
  "model_name": "Model-ABC-100",
  "oid_prefix": "1.3.6.1.4.1.12345",
  "selected_fields": [
    {
      "name": "deviceInfo",
      "oid": "1.3.6.1.4.1.12345.1.1",
      "type": "OCTET STRING"
    },
    {
      "name": "cpuUsage",
      "oid": "1.3.6.1.4.1.12345.2.1",
      "type": "INTEGER"
    },
    {
      "name": "memoryUsage",
      "oid": "1.3.6.1.4.1.12345.2.2",
      "type": "INTEGER"
    }
  ]
}
```

### Step 5: Apply Template to All Similar Devices
```bash
POST /api/v1/services/create-from-template

{
  "template_id": "tpl_xyz_abc_100",
  "device_filter": {
    "vendor": "VendorXYZ",
    "model": "Model-ABC-100"
  },
  "monitoring_interval": 300,  # 5 minutes
  "alert_thresholds": {
    "cpuUsage": {"warning": 80, "critical": 95},
    "memoryUsage": {"warning": 85, "critical": 95}
  }
}
```

## 🔌 API Endpoints (Backend)

### Upload MIB
```bash
POST /api/v1/mib/upload
- Parse MIB
- Extract OIDs and metadata
- Return available fields
```

### Create Template
```bash
POST /api/v1/mib/templates
- Save template to DB
- Make it reusable
```

### List Templates
```bash
GET /api/v1/mib/templates?vendor=VendorXYZ
- List all templates for a vendor
```

### Create Service from Template
```bash
POST /api/v1/services/templates/{template_id}
- Create monitoring service
- Apply to matching devices
- Setup alerts and dashboards
```

### Query with Template
```bash
POST /api/v1/discovery/query-template
{
  "host": "10.1.1.1",
  "template_id": "tpl_xyz_abc_100",
  "snmp_community": "public"
}
- Collector queries device using template
- Returns normalized data
```

## 📊 Database Schema

### MIB Templates Table
```sql
CREATE TABLE mib_templates (
  id UUID PRIMARY KEY,
  vendor_name VARCHAR(255),
  model_name VARCHAR(255),
  oid_prefix VARCHAR(100),
  template_data JSONB,  -- Full template JSON
  created_at TIMESTAMP,
  created_by UUID,
  tenant_id UUID,
  UNIQUE(tenant_id, vendor_name, model_name)
);
```

### Monitoring Services Table
```sql
CREATE TABLE monitoring_services (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES mib_templates(id),
  service_name VARCHAR(255),
  description TEXT,
  selected_fields JSONB,  -- Which fields to monitor
  query_interval INTEGER,  -- Seconds
  alert_rules JSONB,
  created_at TIMESTAMP,
  tenant_id UUID
);
```

## 🚀 Example: Custom Vendor Workflow

### 1. Client Uploads Custom MIB
```
Vendor: "LegacyRouter"
Model: "LR-5000"
File: legacy-router-mib.txt
```

### 2. Platform Parses
```
Found 47 OID objects:
  - systemInfo
  - interfaceCount
  - portStatus_1 to portStatus_48
  - cpuLoad
  - memoryUsed
  - temperatureSensor
  ...
```

### 3. User Selects Relevant Fields
```
Selected:
  ✓ systemInfo
  ✓ interfaceCount
  ✓ portStatus_1 to portStatus_48
  ✓ cpuLoad
  ✓ temperatureSensor
Deselected:
  ✗ obsoleteField1
  ✗ obsoleteField2
```

### 4. Template Created & Reused
```
All LegacyRouter LR-5000 devices automatically
start monitoring with same fields!

Every 5 minutes:
  - Query 48 port statuses
  - Check CPU load
  - Monitor temperature
  - Alert if any port down or temp > 80°C
```

## 💡 Benefits

✅ **Zero Manual Config**: Auto-detect device model  
✅ **Universal Support**: Any vendor via MIB upload  
✅ **Reusable Templates**: One upload, apply to all similar devices  
✅ **Smart Parsing**: Extract OID hierarchy automatically  
✅ **User-Friendly**: Visual field selector  
✅ **Scalable**: Templates stored once, used many times  

## 🔧 Integration with Collector

Collector loads templates at startup:

```go
templateMgr := mib.NewTemplateManager()
templateMgr.LoadAllTemplates(database)

// Later, when querying unknown device:
template := templateMgr.GetTemplate("VendorXYZ-Model-ABC")
if template != nil {
  data := template.QueryDevice(host, community)
  // Data is already normalized
}
```

## 📈 Monitoring Service Example

```json
{
  "id": "svc_123",
  "name": "VendorXYZ Infrastructure Monitoring",
  "template_id": "tpl_xyz_abc_100",
  "devices": [
    "10.1.1.1",
    "10.1.1.2",
    "10.1.1.3"
  ],
  "metrics": [
    {
      "field": "cpuUsage",
      "interval": 300,
      "alert_warning": 80,
      "alert_critical": 95,
      "actions": ["email", "slack", "ticket"]
    },
    {
      "field": "memoryUsage",
      "interval": 300,
      "alert_warning": 85,
      "alert_critical": 95,
      "actions": ["email", "slack"]
    }
  ]
}
```
