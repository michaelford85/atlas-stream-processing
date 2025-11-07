# 🧩 Atlas Stream Processor — Kafka Stock Prices

This directory contains an **Ansible-driven workflow** for building and managing a MongoDB **Atlas Stream Processing (ASP)** pipeline that ingests **stock trade data** from Kafka and writes it into an Atlas database collection.

---

## 📁 Folder Overview

```
kafka_stream_stock_prices/
├── files/
│   └── stream_processor_definition.json     # Rendered or static JSON definition for the Stream Processor
├── templates/
│   └── stream_processor.j2                  # Jinja2 template used to generate the processor definition dynamically
├── vars/
│   ├── processor_details.yml                # Variable file containing names, connection IDs, and Kafka/Atlas details
├── create-asp-connections.yml               # Playbook for creating Kafka and Atlas Database connections
├── create-atlas-stream-processor.yml        # Playbook for creating, validating, and starting the Stream Processor
```

---

## 🎯 Purpose

The goal of this automation is to create a **streaming data pipeline** in Atlas that continuously processes stock trade events from a Kafka topic (for example, `stock_prices`) and sinks them into an Atlas collection for downstream analytics.

You can use this as a template for other real-time workloads like market data, IoT metrics, or trade aggregation.

---

## ⚙️ Components

### 1. **Kafka Connection**
Defined and created via `create-asp-connections.yml`.  
This sets up an external source connection (e.g., Confluent Cloud or self-managed Kafka).

Key fields:
```yaml
type: "KAFKA"
bootstrapServers: "broker1:9092,broker2:9092"
security:
  protocol: "SASL_SSL"
authentication:
  mechanism: "PLAIN"
  username: "{{ client_id }}"
  password: "{{ client_secret }}"
networking:
  access:
    type: "PUBLIC"
```

### 2. **Atlas Database Connection**
Also created in `create-asp-connections.yml`, this enables ASP to write directly to your Atlas cluster.

Example:
```yaml
type: "ATLAS"
clusterName: "{{ atlas_cluster_name }}"
dbRoleToExecute:
  role: "readWriteAnyDatabase"
  type: "BUILT_IN"
```

### 3. **Stream Processor Definition**
The **JSON pipeline** (rendered from `templates/stream_processor.j2`) defines how data flows:

```json
{
  "name": "{{ stream_processor_name }}",
  "pipeline": [
    {
      "name": "source",
      "type": "KAFKA",
      "connectionName": "{{ kafka_connection_name }}",
      "topic": "stock_prices"
    },
    {
      "name": "sink",
      "type": "ATLAS",
      "connectionName": "{{ atlas_db_connection_name }}",
      "db": "{{ atlas_db_name }}",
      "collection": "{{ atlas_collection_name }}"
    }
  ]
}
```

---

## 🚀 Workflow

### Step 1. Configure Variables
Edit `vars/processor_details.yml` to define:
```yaml
atlas_group_id: "<your Atlas project ID>"
workspace_name: "mford-demo-workspace"
atlas_public_key: "<your Atlas API public key>"
atlas_private_key: "<your Atlas API private key>"
kafka_connection_name: "confluent_cloud"
atlas_db_connection_name: "atlas_db_conn_1"
atlas_db_name: "market"
atlas_collection_name: "stock_prices"
stream_processor_name: "kafka_stock_trade_processor"
```

---

### Step 2. Create Connections
Run:
```bash
ansible-playbook create-asp-connections.yml
```
This provisions both Kafka and Atlas database connections in the Atlas Stream Processing workspace.

---

### Step 3. Deploy the Stream Processor
Render and post the Stream Processor to Atlas:

```bash
ansible-playbook create-atlas-stream-processor.yml
```

The playbook will:
1. Check if a processor with that name already exists.
2. Render your `stream_processor.j2` template.
3. Submit the JSON to the Atlas Streams API.
4. Start the processor automatically.

---

### Step 4. Verify and Monitor
You can verify your processor in the **Atlas UI** under  
**Stream Processing → Stream Processors → Connection Registry**.

Alternatively, use the API or CLI:
```bash
atlas streams processors list --projectId <groupId> --tenantName <workspace_name>
```

---

## 🧠 Troubleshooting

| Error | Likely Cause | Fix |
|-------|---------------|-----|
| `URL can't contain control characters` | Stream Processor name contains spaces | Use `{{ stream_processor_name | urlencode }}` or underscores in names |
| `400 Bad Request: Validation Error` | JSON schema mismatch | Check `pipeline` syntax, especially `type` and `connectionName` fields |
| `409 Conflict` | Processor or connection already exists | Idempotent check should skip creation |
| `500 Internal Server Error` | Invalid combination of fields or unready connections | Re-run once connections are active |

---

## 📈 Example Use Case

A Kafka topic named `stock_prices` streams real-time stock trade data (symbol, price, volume, timestamp).  
The processor ingests this stream and stores it into an Atlas collection named `market.stock_prices`, enabling:

- Real-time dashboards for stock price movement
- Historical aggregation via Atlas Charts or aggregation pipelines
- Integration with MongoDB Atlas Triggers or Atlas Vector Search for analytics

---

## 🧰 Requirements

- Ansible ≥ 2.16
- Python ≥ 3.9 with `requests` and `jmespath`
- MongoDB Atlas project with:
  - Stream Processing enabled
  - Atlas Admin API access keys
  - Kafka topic accessible from the allowed IPs in Atlas

---

## 📄 License
MIT License — feel free to reuse or adapt for other event-driven workloads.

---

## 👤 Author
**Michael Ford**  
Example repository: [atlas-stream-processing](https://github.com/mford/atlas-stream-processing)
