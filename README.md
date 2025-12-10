# MongoDB Atlas Stream Processing (ASP) Examples

This repository showcases **real-world examples** of how to use **MongoDB Atlas Stream Processing (ASP)** to build continuous data pipelines that transform, enrich, and materialize data in real time — all within MongoDB Atlas.

These examples demonstrate how Atlas Stream Processing can:
- Ingest and process streaming data (e.g., from Kafka or Confluent Cloud)
- Continuously transform, join, and enrich data from multiple MongoDB collections
- Create **live materialized views** that update automatically
- Operate entirely within **Atlas**, without needing external ETL tools

---

## 🔧 Utility Scripts

### List MongoDB Atlas Projects
**Playbook:** [`list-atlas-projects.yml`](./list-atlas-projects.yml)  
- Lists all MongoDB Atlas Projects (Groups) that your API credentials have access to
- Useful for finding your Project ID before running the examples
- See [LIST_PROJECTS_README.md](./LIST_PROJECTS_README.md) for setup and usage instructions

---

## 📚 Example Directories

### 1. [`kafka_stream_stock_prices/`](./kafka_stream_stock_prices)
**Use Case:** Real-time Stock Price Processing from Confluent Cloud  
- Demonstrates how to connect **Kafka/Confluent** as a source and **MongoDB Atlas** as a sink.  
- Streams and transforms stock trade data, maintaining a live collection of recent stock prices.  
- Example files:
  - `create-asp-source-sink-connection.yml` — Creates Kafka and MongoDB connectors
  - `stream_processor_definition.json` — Defines the stream processor pipeline
  - `test_data.js` — Generates mock stock trade data for local testing

🧠 *Goal:* Show how ASP integrates with external streams to provide **real-time analytics** and **data ingestion** capabilities in Atlas.

---

### 2. [`atlas_db_materialized_views/`](./atlas_db_materialized_views)
**Use Case:** Building Real-Time Materialized Views from MongoDB Sample Data  
- Uses the built-in **Sample Analytics Dataset** provided by Atlas  
- Demonstrates how to:
  - Flatten and enrich data from multiple collections (`customers`, `accounts`, `transactions`)
  - Join data streams to create an enriched output (`transactions_enriched`)
  - Use **Ansible** and Jinja templates to create and deploy stream processors programmatically  
- Example files:
  - `templates/*.j2` — Processor definitions for each stage
  - `processor_details.yml` — Safe public configuration file
  - `create_processors.yml` — Deploys all processors to Atlas

🧠 *Goal:* Show how to use ASP to create **automated, always-fresh views** of related collections without traditional batch ETL.

---

## 🚀 Running These Examples Yourself

You can run both examples using your own **Free Tier MongoDB Atlas cluster**:

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)  
2. Load the **Sample Data** (via *Collections → Load Sample Dataset*)  
3. Create **Programmatic API Keys** under *Access Manager → API Keys*  
4. Install [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) and [Python 3](https://www.python.org/downloads/)  
5. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/atlas-stream-processing-examples.git
   cd atlas-stream-processing-examples
   ```
6. Update `processor_details_local.yml` with your Atlas project ID and API keys.
7. Run the playbook:
   ```bash
   ansible-playbook create_processors.yml -e @processor_details_local.yml
   ```

Both pipelines will deploy processors directly into your Atlas environment.

---

## 🧠 Why Atlas Stream Processing?

MongoDB Atlas Stream Processing (ASP) allows you to:
- Ingest and process event streams **directly inside Atlas**
- Use familiar **MongoDB aggregation syntax** for transformations
- Combine **streaming** and **historical** data seamlessly
- Produce **real-time, queryable views** for dashboards, analytics, and applications

No separate ETL service. No complex infrastructure. Just MongoDB.

---

## 🪶 License

MIT License © 2025 Michael Ford  
Feel free to fork, modify, and experiment!
