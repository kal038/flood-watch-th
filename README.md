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
| Expected rainfall | [Open-Meteo forecast API](https://open-meteo.com/en/docs) | 24-hour forecast near central Rayong, 12.683° N, 101.269° E |

The dashboard shows source observation dates and flags gauge readings older than three hours. The Nong Bua gauge is upstream on Khlong Yai in Ban Khai District. Ban Khao Bot is in Thap Ma, Mueang Rayong District, on Khlong Kached. Neither measures inundation depth in downtown streets. RID's API documentation does not state a time unit for its `inflow` or `outflow` fields, so the dashboard labels those as raw API values.

Reservoir readings are daily; gauge readings update more often. Placing them together does not establish that releases caused flooding at a particular location. Local rainfall, drains, tributaries, and downstream water conditions matter.

If RID has created the current-day record but has not yet populated its operational fields, the dashboard uses the prior day’s non-empty record and labels it as the latest RID reading. It also states that RID has not published today’s readings. This prevents an empty daily record from looking like zero flow.

The forecast uses Open-Meteo’s free public API and requires no API key. It represents a model grid point near central Rayong, so it should be read as a planning signal rather than a street-level rainfall prediction.

Each local-rain card compares its displayed 24-hour reading with the same station’s most recent earlier non-empty ThaiWater history reading. A green down-right arrow means lower rainfall, yellow right arrow means within 0.1 mm of the earlier reading, and red up-right arrow means higher rainfall. A gray dash means that station has no earlier non-empty value to compare.

Each upstream reservoir percentage uses the same arrows against its previous RID daily percentage. The yellow threshold is within 0.1 percentage points; the icon tooltip shows the comparison reading and date.

## Check

```sh
npm test
```

For a live smoke test, run the server and inspect `/api/snapshot` and `/api/history` in a browser. The external APIs must be reachable for live data to appear. If an upstream source fails, its cards show missing data; the page does not invent values.
