import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const RID = 'https://app.rid.go.th/reservoir/api';
const THAIWATER = 'https://api-v3.thaiwater.net/api/v1/thaiwater30';
const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast?latitude=12.683&longitude=101.269&hourly=precipitation,precipitation_probability&forecast_hours=24&timezone=Asia%2FBangkok';
const sources = {
  dam: `${RID}/dam/public`,
  reservoir: `${RID}/reservoir/public`,
  waterlevel: `${THAIWATER}/provinces/waterlevel?province_code=21`,
  rainfall: `${THAIWATER}/provinces/rain24?include_zero=1&province_code=21`,
  forecast: OPEN_METEO,
};
const ids = { nongPlaLai: '100504', dokKrai: 'rsv357', khlongYai: 'rsv359' };
const gauges = { nongBua: 118, banKhaoBot: 505011 };
const cache = new Map();

async function json(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000), headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  return response.json();
}

async function cached(key, ttl, create) {
  const existing = cache.get(key);
  if (existing && Date.now() - existing.time < ttl) return existing.value;
  if (existing?.promise) return existing.promise;
  const promise = create().then(value => {
    cache.set(key, { time: Date.now(), value });
    return value;
  }).catch(error => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { promise });
  return promise;
}

function flattenRid(payload, key) {
  return (payload?.data || []).flatMap(region => region[key] || []);
}

function reservoirRecord(record, key, label, source, date) {
  if (!record) return null;
  return {
    key, label, id: record.id, date, source,
    storage: number(record.storage), volume: number(record.volume),
    percent: number(record.percent_storage), inflow: number(record.inflow), outflow: number(record.outflow),
  };
}

function hasOperationalReading(record) {
  return ['volume', 'percent_storage', 'inflow', 'outflow'].some(field => number(record?.[field]) !== null);
}

function latestReservoirRecord(current, previous, key, label, source, currentDate, previousDate) {
  const usePrevious = !hasOperationalReading(current) && hasOperationalReading(previous);
  return {
    ...reservoirRecord(usePrevious ? previous : current, key, label, source, usePrevious ? previousDate : currentDate),
    currentDate: currentDate || null,
    isFallback: usePrevious,
  };
}

function number(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function gaugeRecord(record, key, label) {
  if (!record) return null;
  const bank = number(record.station?.min_bank);
  const level = number(record.waterlevel_msl);
  return {
    key, label, stationId: record.station.id, stationCode: record.station.tele_station_oldcode,
    dateTime: record.waterlevel_datetime, waterLevel: level, bankLevel: bank,
    belowBank: bank === null || level === null ? null : +(bank - level).toFixed(2),
    previousLevel: number(record.waterlevel_msl_previous),
    river: record.river_name || null,
    district: record.geocode?.amphoe_name?.th || null,
    subdistrict: record.geocode?.tumbon_name?.th || null,
    subdistrictEn: record.geocode?.tumbon_name?.en || null,
    lat: number(record.station.tele_station_lat), lon: number(record.station.tele_station_long),
  };
}

function forecastRecord(payload) {
  const hourly = payload?.hourly;
  const points = (hourly?.time || []).map((dateTime, index) => ({
    dateTime,
    precipitation: number(hourly.precipitation?.[index]),
    probability: number(hourly.precipitation_probability?.[index]),
  })).filter(point => point.precipitation !== null || point.probability !== null);
  if (!points.length) return null;
  const total = points.reduce((sum, point) => sum + (point.precipitation || 0), 0);
  const peak = points.reduce((highest, point) => (point.precipitation || 0) > (highest.precipitation || 0) ? point : highest, points[0]);
  return {
    location: 'Downtown Rayong',
    latitude: number(payload.latitude), longitude: number(payload.longitude),
    timezone: payload.timezone || 'Asia/Bangkok',
    hours: points, total: +total.toFixed(1),
    peakProbability: Math.max(...points.map(point => point.probability || 0)),
    peakPrecipitation: peak.precipitation || 0, peakTime: peak.dateTime,
    source: 'https://open-meteo.com/en/docs',
  };
}

export function normalizeSnapshot(parts, previous = {}) {
  const dams = flattenRid(parts.dam, 'dam');
  const medium = flattenRid(parts.reservoir, 'reservoir');
  const stations = parts.waterlevel?.data || [];
  const rainfall = (parts.rainfall?.data || [])
    .filter(item => item.geocode?.amphoe_code === '01' || item.geocode?.amphoe_name?.th === 'เมืองระยอง')
    .map(item => ({
      name: item.station?.tele_station_name?.th || 'ไม่ระบุ',
      nameEn: item.station?.tele_station_name?.en || null,
      subdistrict: item.geocode?.tumbon_name?.th || null,
      subdistrictEn: item.geocode?.tumbon_name?.en || null,
      amount24h: number(item.rain_24h), amount1h: number(item.rain_1h),
      dateTime: item.rainfall_datetime,
    }))
    .filter(item => item.amount24h !== null)
    .sort((a, b) => b.amount24h - a.amount24h)
    .slice(0, 5);
  const find = (list, id) => list.find(item => item.id === id);
  const findGauge = id => stations.find(item => item.station?.id === id);
  return {
    fetchedAt: new Date().toISOString(),
    reservoirs: [
      latestReservoirRecord(find(dams, ids.nongPlaLai), find(flattenRid(previous.dam, 'dam'), ids.nongPlaLai), 'nongPlaLai', 'หนองปลาไหล', sources.dam, parts.dam?.date, previous.dam?.date),
      latestReservoirRecord(find(medium, ids.dokKrai), find(flattenRid(previous.reservoir, 'reservoir'), ids.dokKrai), 'dokKrai', 'ดอกกราย', sources.reservoir, parts.reservoir?.date, previous.reservoir?.date),
      latestReservoirRecord(find(medium, ids.khlongYai), find(flattenRid(previous.reservoir, 'reservoir'), ids.khlongYai), 'khlongYai', 'คลองใหญ่', sources.reservoir, parts.reservoir?.date, previous.reservoir?.date),
    ],
    gauges: [
      gaugeRecord(findGauge(gauges.nongBua), 'nongBua', 'หนองบัว · ลำน้ำคลองใหญ่'),
      gaugeRecord(findGauge(gauges.banKhaoBot), 'banKhaoBot', 'บ้านเขาโบสถ์ · ทับมา'),
    ],
    rainfall,
    forecast: forecastRecord(parts.forecast),
    sources,
  };
}

async function previousPublishedReservoirData(parts) {
  const dams = flattenRid(parts.dam, 'dam');
  const medium = flattenRid(parts.reservoir, 'reservoir');
  const needsDam = !hasOperationalReading(dams.find(item => item.id === ids.nongPlaLai));
  const needsMedium = [ids.dokKrai, ids.khlongYai].some(id => !hasOperationalReading(medium.find(item => item.id === id)));
  if (!needsDam && !needsMedium) return {};

  const date = bangkokDate(-1);
  const requests = await Promise.allSettled([
    needsDam ? json(`${RID}/dam/public/${date}`) : Promise.resolve(null),
    needsMedium ? json(`${RID}/reservoir/public/${date}`) : Promise.resolve(null),
  ]);
  return {
    ...(requests[0].status === 'fulfilled' && requests[0].value ? { dam: requests[0].value } : {}),
    ...(requests[1].status === 'fulfilled' && requests[1].value ? { reservoir: requests[1].value } : {}),
  };
}

async function snapshot() {
  return cached('snapshot', 5 * 60_000, async () => {
    const entries = await Promise.allSettled(Object.entries(sources).map(async ([key, url]) => [key, await json(url)]));
    const parts = {};
    const errors = {};
    entries.forEach((entry, index) => {
      const key = Object.keys(sources)[index];
      if (entry.status === 'fulfilled') parts[key] = entry.value[1];
      else errors[key] = entry.reason?.message || 'Unavailable';
    });
    const previous = await previousPublishedReservoirData(parts);
    return { ...normalizeSnapshot(parts, previous), errors };
  });
}

function bangkokDate(offset = 0) {
  const current = new Date(Date.now() + 7 * 3600_000 + offset * 86400_000);
  return current.toISOString().slice(0, 10);
}

async function gaugeHistory(id) {
  const start = bangkokDate(-2);
  const end = bangkokDate(1);
  const url = `${THAIWATER}/public/waterlevel_graph?station_type=tele_waterlevel&station_id=${id}&start_date=${start}&end_date=${end}`;
  const response = await json(url);
  return (response.data?.graph_data || [])
    .map(point => ({ dateTime: point.datetime, level: number(point.value) }))
    .filter(point => point.level !== null);
}

async function history() {
  return cached('history', 10 * 60_000, async () => {
    const dates = Array.from({ length: 7 }, (_, i) => bangkokDate(i - 6));
    const tasks = dates.flatMap(date => [
      json(`${RID}/dam/public/${date}`).then(data => ({ date, type: 'dam', data })),
      json(`${RID}/reservoir/public/${date}`).then(data => ({ date, type: 'reservoir', data })),
    ]);
    const results = await Promise.allSettled([...tasks, gaugeHistory(gauges.nongBua), gaugeHistory(gauges.banKhaoBot)]);
    const daily = Object.fromEntries(dates.map(date => [date, { date }]));
    results.slice(0, tasks.length).forEach(result => {
      if (result.status !== 'fulfilled') return;
      const { date, type, data } = result.value;
      const list = flattenRid(data, type === 'dam' ? 'dam' : 'reservoir');
      if (type === 'dam') daily[date].nongPlaLai = number(list.find(item => item.id === ids.nongPlaLai)?.outflow);
      else {
        daily[date].dokKrai = number(list.find(item => item.id === ids.dokKrai)?.outflow);
        daily[date].khlongYai = number(list.find(item => item.id === ids.khlongYai)?.outflow);
      }
    });
    return {
      releases: Object.values(daily),
      gauges: {
        nongBua: results[tasks.length].status === 'fulfilled' ? results[tasks.length].value : [],
        banKhaoBot: results[tasks.length + 1].status === 'fulfilled' ? results[tasks.length + 1].value : [],
      },
    };
  });
}

const staticFiles = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (request.method !== 'GET') {
      response.writeHead(405).end('Method not allowed');
      return;
    }
    if (url.pathname === '/api/snapshot' || url.pathname === '/api/history') {
      const data = url.pathname === '/api/snapshot' ? await snapshot() : await history();
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }).end(JSON.stringify(data));
      return;
    }
    const file = staticFiles[url.pathname];
    if (!file) {
      response.writeHead(404).end('Not found');
      return;
    }
    const content = await readFile(path.join(root, 'public', file[0]));
    response.writeHead(200, { 'content-type': file[1], 'cache-control': 'no-cache' }).end(content);
  } catch (error) {
    response.writeHead(502, { 'content-type': 'application/json; charset=utf-8' }).end(JSON.stringify({ error: error.message }));
  }
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(port, () => console.log(`Rayong flood watch: http://localhost:${port}`));
}

export { server, number };
