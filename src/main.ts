import "./style.css";
import { barChart } from "./bar-chart";
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
import parquet from "./pittsburgh-air-quality.parquet?url";

// Load a Parquet file and regioster it with DuckDB. We could request the data from a URL instead.
const res = await fetch(parquet);
await db.registerFileBuffer(
  "air.parquet",
  new Uint8Array(await res.arrayBuffer())
);

// Query DuckDB for the data we want to visualize.
const conn = await db.connect();

const data: Table<{ "Station name": Utf8; cnt: Int32 }> = await conn.query(`
SELECT "Station name", count(*)::INT as cnt
FROM air.parquet
GROUP BY "Station name"
ORDER BY cnt DESC`);

// Get the X and Y columns for the chart. Instead of using Parquet, DuckDB, and Arrow, we could also load data from CSV or JSON directly.
const X = data.getChild("cnt")!.toArray();
const Y = data
  .getChild("Station name")!
  .toJSON()
  .map((d) => `${d}`);

// Create the chart. The specific code here makes some assumptions that may not hold for you.
const chart = barChart(X, Y);

// Add the chart to the DOM.
document.querySelector("#app")!.appendChild(chart);
