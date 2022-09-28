import './style.css'
import {barChart} from './bar-chart'
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";

const conn = await db.connect();

const data: Table<{ "Station name": Utf8; cnt: Int32 }> = await conn.query(`
SELECT "Station name", count(*)::INT as cnt
FROM air.parquet
GROUP BY "Station name"
ORDER BY cnt DESC`);

const X = data.getChild("cnt")!.toArray();
const Y = data
  .getChild("Station name")!
  .toJSON()
  .map((d) => `${d}`);

const chart = barChart(X, Y);

document.querySelector("#app")!.appendChild(chart)
