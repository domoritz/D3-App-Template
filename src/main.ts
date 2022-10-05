import "./style.css";
import * as d3 from "d3";

import { barChart } from "./bar-chart";
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
import parquet from "./weather.parquet?url";

const app = document.querySelector("#app")!;

// Create the chart. The specific code here makes some assumptions that may not hold for you.
const chart = barChart();

async function update(location: string) {
  // Query DuckDB for the data we want to visualize.
  const data: Table<{ weather: Utf8; cnt: Int32 }> = await conn.query(`
  SELECT weather, count(*)::INT as cnt
  FROM weather.parquet
  WHERE location = '${location}'
  GROUP BY weather
  ORDER BY cnt DESC`);

  // Get the X and Y columns for the chart. Instead of using Parquet, DuckDB, and Arrow, we could also load data from CSV or JSON directly.
  const X = data.getChild("cnt")!.toArray();
  const Y = data
    .getChild("weather")!
    .toJSON()
    .map((d) => `${d}`);

  chart.update(X, Y);
}

// Load a Parquet file and register it with DuckDB. We could request the data from a URL instead.
const res = await fetch(parquet);
await db.registerFileBuffer(
  "weather.parquet",
  new Uint8Array(await res.arrayBuffer())
);

// Query DuckDB for the locations.
const conn = await db.connect();

const locations: Table<{ location: Utf8 }> = await conn.query(`
SELECT DISTINCT location
FROM weather.parquet`);

// Create a select element for the locations.
const select = d3.select(app).append("select");
for (const location of locations) {
  select.append("option").text(location.location);
}

select.on("change", () => {
  const location = select.property("value");
  update(location);
});

// Update the chart with the first location.
update("Seattle");

// Add the chart to the DOM.
app.appendChild(chart.element);
