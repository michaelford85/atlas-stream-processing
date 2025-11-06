# Atlas Stream Processing Demonstrations

This repository showcases practical demonstrations of **MongoDB Atlas Stream Processing (ASP)**, highlighting how to build real-time data pipelines that connect event streams (e.g., Kafka, AWS Kinesis) with MongoDB Atlas.

---

## 🌊 Overview

**MongoDB Atlas Stream Processing (ASP)** enables continuous processing of data in motion — allowing you to consume from event sources like **Kafka**, perform real-time transformations and aggregations, and emit the results to **Atlas**, **Kinesis**, or other sinks.

This repository includes examples designed to illustrate:
- **Kafka → ASP → MongoDB Atlas**: Ingest, enrich, and persist real-time events.
- **Kafka → ASP → Kinesis**: Stream processed data to downstream systems.
- **Real-time analytics** with tumbling windows, joins, and aggregations.
- **Error handling** using dead-letter queues.
- **Schema validation** and event enrichment in-flight.

---

## 🧩 Repository Structure

```
atlas-stream-processing/
├── README.md
├── pipelines/
│   ├── kafka_to_atlas.json
│   ├── kafka_to_kinesis.json
│   ├── tumbling_window_analytics.json
│   └── schema_validation.json
├── datasets/
│   ├── orders_sample.json
│   ├── users_sample.json
│   └── pageviews_sample.json
├── connections/
│   ├── kafka_connection.json
│   ├── atlas_connection.json
│   └── kinesis_connection.json
├── demos/
│   ├── kafka_to_atlas/
│   │   ├── README.md
│   │   └── demo_setup.sh
│   └── kafka_to_kinesis/
│       ├── README.md
│       └── demo_setup.sh
└── scripts/
    ├── generate_kafka_data.sh
    ├── generate_kinesis_data.sh
    └── cleanup_resources.sh
```

---

## 🚀 Quick Start

### 1. Prerequisites
- A **MongoDB Atlas cluster** (M10 or higher)
- **Atlas Stream Processing** workspace enabled
- Access to a **Kafka** or **Confluent Cloud** cluster (for sample data)
- Optional: **AWS Kinesis** for sink demonstration

### 2. Create Connection Registries
Register your data sources and sinks in the ASP Connection Registry:
```bash
connections/
├── kafka_connection.json
├── atlas_connection.json
└── kinesis_connection.json
```

### 3. Deploy a Sample Pipeline
Example: ingest `orders` data from Kafka and write to an Atlas collection.
```javascript
[
  {
    $source: {
      connectionName: "confluent-kafka",
      topic: "orders",
      timeField: { path: "eventTime" }
    }
  },
  { $addFields: { ingestedAt: $$NOW } },
  {
    $emit: {
      connectionName: "atlas-target",
      db: "demo",
      coll: "orders_streamed"
    }
  }
]
```

Upload this pipeline via the **Atlas UI** or **Atlas CLI**:
```bash
atlas streams pipelines create --file pipelines/kafka_to_atlas.json
```

---

## 🧪 Sample Data Generators

Use one of the included scripts to simulate live data streams:

### Kafka
```bash
./scripts/generate_kafka_data.sh
```
Uses Confluent Cloud’s **Datagen Source Connector** to publish mock `orders`, `users`, and `pageviews` events.

### Kinesis
```bash
./scripts/generate_kinesis_data.sh
```
Uses the **Amazon Kinesis Data Generator (KDG)** to send mock JSON events to your stream.

---

## 📊 Example Use Cases

| Scenario | Description |
|-----------|--------------|
| **Real-Time Order Tracking** | Enrich incoming order events with customer metadata before persisting to Atlas. |
| **Clickstream Aggregation** | Aggregate pageviews per user in a 30-second tumbling window. |
| **Cross-Stream Join** | Join Kafka topics `orders` and `users` to create a unified analytics view. |
| **Error Routing** | Send invalid messages to a Dead Letter Queue (DLQ) for inspection. |

---

## 🧱 Technologies Used
- **MongoDB Atlas Stream Processing**
- **Apache Kafka / Confluent Cloud**
- **AWS Kinesis**
- **MongoDB Atlas Database**
- **Bash & JSON pipeline definitions**

---

## 📚 Learn More
- [MongoDB Atlas Stream Processing Documentation](https://www.mongodb.com/docs/atlas/stream-processing/)
- [Kafka $source Reference](https://www.mongodb.com/docs/atlas/stream-processing/stages/source/)
- [Kinesis $emit Reference](https://www.mongodb.com/docs/atlas/stream-processing/stages/emit/)
- [Confluent Cloud Datagen Connector](https://docs.confluent.io/cloud/current/connectors/cc-datagen.html)
- [AWS Kinesis Data Generator](https://awslabs.github.io/amazon-kinesis-data-generator/web/producer.html)

---

## 🧠 Contributing
Pull requests are welcome!  
If you’d like to contribute new pipelines, data generators, or visualization demos, please open a PR with:
- A new folder under `/demos`
- Corresponding JSON pipeline(s)
- A `README.md` explaining the demo’s flow and purpose

---

## 📝 License
This project is licensed under the **Apache 2.0 License** — see the [LICENSE](LICENSE) file for details.
