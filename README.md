# Rayong Flood Watch

A small Thai-language dashboard showing three reservoirs connected to the Rayong River system, nearby water-level gauges, and rainfall in Mueang Rayong District. It gives the community a shared view of public measurements, not a street flood-depth estimate or forecast.

## Run

Requires Node.js 20 or newer. No package installation is needed.

```sh
npm start
```

Open <http://localhost:3000>. Set `PORT` to use another port. The server fetches the public APIs and serves the dashboard from the same origin. Snapshot responses are cached for five minutes; history for ten minutes. The page refreshes every five minutes.

## Data

| Measurement | Source | Selected records |
| --- | --- | --- |
| Nong Pla Lai reservoir | [RID large-dam API](https://app.rid.go.th/reservoir/api/dam/public) | `100504` |
| Dok Krai and Khlong Yai reservoirs | [RID medium-reservoir API](https://app.rid.go.th/reservoir/api/reservoir/public) | `rsv357`, `rsv359` |
| River and local channel levels | [ThaiWater Rayong page](https://rayong.thaiwater.net/wl) and its public API | Nong Bua `118`, Ban Khao Bot `505011` |
| Rainfall | [ThaiWater Rayong page](https://rayong.thaiwater.net/) and its public API | Mueang Rayong stations |

The dashboard shows source observation dates and flags gauge readings older than three hours. The Nong Bua gauge is upstream on Khlong Yai in Ban Khai District. Ban Khao Bot is in Thap Ma, Mueang Rayong District, on Khlong Kached. Neither measures inundation depth in downtown streets. RID's API documentation does not state a time unit for its `inflow` or `outflow` fields, so the dashboard labels those as raw API values.

Reservoir readings are daily; gauge readings update more often. Placing them together does not establish that releases caused flooding at a particular location. Local rainfall, drains, tributaries, and downstream water conditions matter.

If RID has created the current-day record but has not yet populated its operational fields, the dashboard uses the prior day’s non-empty record and labels it as the latest RID reading. It also states that RID has not published today’s readings. This prevents an empty daily record from looking like zero flow.

## Check

```sh
npm test
```

For a live smoke test, run the server and inspect `/api/snapshot` and `/api/history` in a browser. The external APIs must be reachable for live data to appear. If an upstream source fails, its cards show missing data; the page does not invent values.
