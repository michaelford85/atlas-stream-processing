// =====================================================================
// MongoDB Atlas Stream Processor Test Data Seeder (safe to rerun)
// =====================================================================

// --- CONFIG ---
const SRC_DB = "sample_analytics";
const SINK_DB = "sample_analytics";

const TEST_TAG = "asp_demo";
const TEST_ACCT = 990001;
const TEST_CUST = new ObjectId();
const NOW = new Date();
const T0 = new Date(NOW.getTime() - 60000);
const T1 = new Date(NOW.getTime() - 30000);
const T2 = new Date(NOW.getTime() - 10000);

// --- Connect to DBs properly ---
use(SRC_DB);
const src = db;
const sink = db.getSiblingDB(SINK_DB);

// --- Clean up old test data ---
[
  () => src.customers.deleteMany({ "meta.tag": TEST_TAG }),
  () => src.accounts.deleteMany({ account_id: TEST_ACCT }),
  () => src.transactions.deleteMany({ account_id: TEST_ACCT }),
  () => sink.customers_ref.deleteMany({ "meta.tag": TEST_TAG }),
  () => sink.accounts_ref.deleteMany({ account_id: TEST_ACCT }),
  () => sink.transactions_flat.deleteMany({ account_id: TEST_ACCT }),
  () => sink.transactions_enriched.deleteMany({ account_id: TEST_ACCT }),
  () => sink.transactions_minute_stats.deleteMany({ symbol: { $in: ["ACME", "ZZZ"] } }),
].forEach(f => { try { f(); } catch(e) {} });

print("🧹 Cleared old test data...");

// --- Insert sample customers and accounts ---
src.customers.insertOne({
  _id: TEST_CUST,
  username: "asp_demo_user",
  name: "ASP Demo",
  accounts: [TEST_ACCT],
  tier_and_details: { tier: "Bronze" },
  email: "asp-demo@example.com",
  meta: { tag: TEST_TAG }
});

src.accounts.insertOne({
  account_id: TEST_ACCT,
  products: ["InvestmentStock"],
  limit: 50000,
  meta: { tag: TEST_TAG }
});

print("✅ Inserted sample customer and account...");

// --- Insert test transactions (matches sample_analytics shape) ---
src.transactions.insertOne({
  account_id: TEST_ACCT,
  transaction_count: 3,
  bucket_start_date: ISODate("2025-01-01T00:00:00Z"),
  bucket_end_date: ISODate("2025-12-31T23:59:59Z"),
  transactions: [
    {
      date: ISODate("2025-01-15T10:00:00Z"),
      amount: 100,
      transaction_code: "buy",
      symbol: "ACME",
      price: 10.00,
      total: 1000
    },
    {
      date: ISODate("2025-01-15T11:30:00Z"),
      amount: 50,
      transaction_code: "sell",
      symbol: "ACME",
      price: 12.50,
      total: 625
    },
    {
      date: ISODate("2025-01-16T09:45:00Z"),
      amount: 77,
      transaction_code: "buy",
      symbol: "ZZZ",
      price: 7.71,
      total: 593.67
    }
  ],
  meta: { tag: TEST_TAG }
});

// --- Burst of trades for tumbling window test ---
src.transactions.insertOne({
  account_id: TEST_ACCT,
  transaction_count: 3,
  bucket_start_date: T0,
  bucket_end_date: NOW,
  transactions: [
    { date: T0, amount: 10, transaction_code: "buy",  symbol: "ACME", price: 20.0, total: 200 },
    { date: T1, amount: 12, transaction_code: "sell", symbol: "ACME", price: 21.0, total: 252 },
    { date: T2, amount: 15, transaction_code: "buy",  symbol: "ACME", price: 22.5, total: 337.5 }
  ],
  meta: { tag: TEST_TAG }
});

print("✅ Inserted test transactions...");
print("⌛ Give your stream processors 10–15s to process this data...");

// --- Optional: verification helper ---
sleep(15000);

print("\n--- SAMPLE OUTPUT CHECKS ---");
print("accounts_ref →");
printjson(sink.accounts_ref.find({ account_id: TEST_ACCT }).limit(1).toArray());

print("\ncustomers_ref →");
printjson(sink.customers_ref.find({ "meta.tag": TEST_TAG }).limit(1).toArray());

print("\ntransactions_flat →");
printjson(sink.transactions_flat.find({ account_id: TEST_ACCT }).sort({ date: 1 }).limit(5).toArray());

print("\ntransactions_enriched →");
printjson(sink.transactions_enriched.find({ account_id: TEST_ACCT }).sort({ date: 1 }).limit(5).toArray());

print("\ntransactions_minute_stats →");
printjson(sink.transactions_minute_stats.find({ symbol: "ACME" }).sort({ windowStart: -1 }).limit(5).toArray());

print("\n✅ Done!");