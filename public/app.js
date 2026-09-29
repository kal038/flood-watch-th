const $ = id => document.getElementById(id);
const staticEn = {
  brand: 'Rayong Flood Watch', refresh: 'Refresh', eyebrow: 'PUBLIC DATA · MUEANG RAYONG',
  heroTitle: 'Track upstream water<br><em>and nearby river levels</em>',
  heroCopy: 'Reservoir data, nearby water-level gauges, and rainfall in Mueang Rayong District in one place for the community.',
  timeZone: 'Thailand time (ICT)',
  notice: 'A gauge reading <strong>is not flood depth on a downtown street.</strong> If your area is flooding, follow conditions on the ground and local authority notices.',
  gaugeKicker: '01 / WATER LEVEL', gaugeHeading: 'Nearby monitoring stations', viewSource: 'View source ↗',
  gaugeNote: 'Nong Bua is upstream on Khlong Yai in Ban Khai District. Ban Khao Bot is on Khlong Kached in Thap Ma, Mueang Rayong District. Neither station measures flood depth on downtown streets.',
  reservoirKicker: '02 / UPSTREAM', reservoirHeading: 'Reservoirs linked to the Rayong River', reservoirSubtle: 'Daily data from the Royal Irrigation Department',
  reservoirNote: '“Outflow” is the API value for the date shown. It is not the amount of water immediately reaching downtown. The API documentation does not specify a time unit for this field.',
  trendKicker: '03 / TRENDS', trendHeading: 'See what is changing',
  levelChartTitle: 'Water level · past 48 hours', levelChartSub: 'Nong Bua · Khlong Yai · metres above mean sea level', waterLevel: 'Water level',
  releaseChartTitle: 'Reservoir outflow · past 7 days', releaseChartSub: 'RID API values · read each reservoir separately',
  nongPlaLai: 'Nong Pla Lai', dokKrai: 'Dok Krai', khlongYai: 'Khlong Yai',
  trendNote: 'These charts put readings on a common timeline. They cannot establish that a reservoir release caused flooding at any location. Local rain, drains, tributaries, and downstream conditions also matter.',
  rainKicker: '04 / LOCAL RAIN', rainHeading: 'Rainfall in the past 24 hours',
  rainNote: 'Stations with data in Mueang Rayong District, ordered by highest rainfall. Green, yellow, and red arrows compare each value with the station’s latest earlier non-empty reading. These readings do not cover every street.',
  forecastKicker: '05 / FORECAST', forecastHeading: 'Expected rainfall · next 24 hours',
  forecastNote: 'Open-Meteo forecast for a point near central Rayong. Use it for early planning only; rainfall can vary significantly between neighbourhoods.',
  sourceKicker: 'DATA SOURCES', sourceHeading: 'Check the original readings',
  sourceCopy: 'Nong Pla Lai is in RID’s large-dam feed; Dok Krai and Khlong Yai are in its medium-reservoir feed. Water levels and rainfall come from ThaiWater. Each reading shows its source date or time.',
  largeSource: 'RID · Large dams ↗', mediumSource: 'RID · Medium reservoirs ↗', levelSource: 'ThaiWater · Water levels ↗',
  footer: 'Made to help the community access public data · Readings may be delayed or missing · ',
};
const originalStatic = [...document.querySelectorAll('[data-i18n], [data-i18n-html]')].map(node => ({ node, html: node.innerHTML }));
const messages = {
  th: { noTime: 'ไม่ระบุเวลา', gaugeMissing: 'สถานีไม่มีข้อมูลในขณะนี้', old: 'ข้อมูลเก่า', bankUnknown: 'ไม่ทราบระดับตลิ่ง', overBank: 'สูงกว่าระดับตลิ่ง', nearBank: 'ใกล้ระดับตลิ่ง', belowBank: 'ต่ำกว่าระดับตลิ่ง', rising: '↑ เพิ่มขึ้น', falling: '↓ ลดลง', steady: '→ ทรงตัว', above: 'สูงกว่า', msl: 'ม.รทก.', metres: 'ม.', bankDistance: 'ห่างจากระดับตลิ่ง', previous: 'เทียบค่าก่อนหน้า', measured: 'วัดเมื่อ', delayed: 'ข้อมูลอาจล่าช้า', reservoirMissing: 'อ่างเก็บน้ำไม่มีข้อมูลในขณะนี้', reservoir: 'อ่างเก็บน้ำ', outflow: 'น้ำระบาย · ค่า API', storage: 'น้ำในอ่าง', inflow: 'น้ำไหลเข้า · ค่า API', millionCubicMetres: 'ล้าน ลบ.ม.', latestRidReading: 'ข้อมูลล่าสุดที่ RID เผยแพร่', waitingForToday: 'RID ยังไม่เผยแพร่ค่าของวันนี้', source: 'ต้นทาง ↗', district: 'เมืองระยอง', mm: 'มม.', rainMissing: 'ไม่มีข้อมูลฝนจากสถานีในอำเภอเมืองระยอง', noGaugeHistory: 'ยังไม่มีข้อมูลย้อนหลังจากสถานี', bankLine: 'ระดับตลิ่ง', noReleaseHistory: 'ยังไม่มีข้อมูลย้อนหลังจาก RID', gaugeChartAlt: 'กราฟระดับน้ำหนองบัวย้อนหลัง 48 ชั่วโมง', releaseChartAlt: 'กราฟน้ำระบายย้อนหลัง 7 วันของสามอ่างเก็บน้ำ', updating: 'กำลังอัปเดต…', fetched: 'ดึงข้อมูลล่าสุด', fetchedShort: 'ดึงข้อมูล', partial: 'ข้อมูลบางแหล่งขัดข้อง', connected: 'เชื่อมต่อข้อมูลแล้ว', disconnected: 'เชื่อมต่อข้อมูลไม่ได้', gaugeError: 'เชื่อมต่อข้อมูลระดับน้ำไม่ได้ กรุณาเปิดแหล่งข้อมูลต้นทาง', reservoirError: 'เชื่อมต่อข้อมูลอ่างเก็บน้ำไม่ได้ กรุณาลองใหม่', rainError: 'เชื่อมต่อข้อมูลฝนไม่ได้', historyError: 'เชื่อมต่อข้อมูลย้อนหลังไม่ได้', contacting: 'กำลังติดต่อแหล่งข้อมูล', chartLoading: 'กำลังโหลดกราฟ…', nongBua: 'หนองบัว · ลำน้ำคลองใหญ่', banKhaoBot: 'บ้านเขาโบสถ์ · ทับมา', nongPlaLai: 'หนองปลาไหล', dokKrai: 'ดอกกราย', khlongYai: 'คลองใหญ่' },
  en: { noTime: 'Time unavailable', gaugeMissing: 'No current reading for this station', old: 'Old reading', bankUnknown: 'Bank level unavailable', overBank: 'Above bank level', nearBank: 'Near bank level', belowBank: 'Below bank level', rising: '↑ Rising', falling: '↓ Falling', steady: '→ Steady', above: 'Above by', msl: 'm MSL', metres: 'm', bankDistance: 'Distance from bank level', previous: 'Since prior reading', measured: 'Measured', delayed: 'Reading may be delayed', reservoirMissing: 'No current reservoir data', reservoir: 'Reservoir', outflow: 'Outflow · API value', storage: 'Water stored', inflow: 'Inflow · API value', millionCubicMetres: 'million m³', latestRidReading: 'Latest RID reading', waitingForToday: 'RID has not published today’s readings', source: 'Source ↗', district: 'Mueang Rayong', mm: 'mm', rainMissing: 'No rainfall station data for Mueang Rayong District', noGaugeHistory: 'No station history available', bankLine: 'Bank level', noReleaseHistory: 'No RID history available', gaugeChartAlt: 'Nong Bua water level over the past 48 hours', releaseChartAlt: 'Seven days of outflow from three reservoirs', updating: 'Updating…', fetched: 'Data fetched', fetchedShort: 'Fetched', partial: 'Some sources are unavailable', connected: 'Data connected', disconnected: 'Could not connect to data', gaugeError: 'Could not load water levels. Check the original source.', reservoirError: 'Could not load reservoir data. Try again.', rainError: 'Could not load rainfall data', historyError: 'Could not load historical data', contacting: 'Contacting data sources', chartLoading: 'Loading chart…', nongBua: 'Nong Bua · Khlong Yai', banKhaoBot: 'Ban Khao Bot · Thap Ma', nongPlaLai: 'Nong Pla Lai', dokKrai: 'Dok Krai', khlongYai: 'Khlong Yai' },
};
Object.assign(messages.th, {
  forecastMissing: 'ไม่มีข้อมูลพยากรณ์ในขณะนี้', forecastTotal: 'ฝนรวมที่คาดใน 24 ชม.',
  peakChance: 'โอกาสเกิดฝนสูงสุด', heaviestHour: 'ชั่วโมงที่คาดว่าฝนมากสุด',
  noRainExpected: 'ยังไม่คาดว่ามีฝน', at: 'เวลา', forecastStarts: 'ช่วงพยากรณ์เริ่ม', forecastSource: 'พยากรณ์โดย Open-Meteo ↗',
});
Object.assign(messages.en, {
  forecastMissing: 'Forecast data is unavailable right now', forecastTotal: 'Expected rain · next 24 h',
  peakChance: 'Highest chance of rain', heaviestHour: 'Heaviest expected hour',
  noRainExpected: 'No rain currently expected', at: 'at', forecastStarts: 'Forecast starts', forecastSource: 'Forecast by Open-Meteo ↗',
});
Object.assign(messages.th, {
  rainDecrease: 'ลดลง', rainSame: 'ใกล้เคียงเดิม', rainIncrease: 'เพิ่มขึ้น', rainTrendUnavailable: 'ไม่มีข้อมูลเปรียบเทียบ',
  comparedWith: 'เทียบกับข้อมูลก่อนหน้า', previousReading: 'ข้อมูลก่อนหน้า',
});
Object.assign(messages.en, {
  rainDecrease: 'Lower rainfall', rainSame: 'About the same', rainIncrease: 'Higher rainfall', rainTrendUnavailable: 'No prior reading',
  comparedWith: 'Compared with the prior reading', previousReading: 'Prior reading',
});
Object.assign(messages.th, {
  storageDecrease: 'ปริมาณน้ำลดลง', storageSame: 'ปริมาณน้ำใกล้เคียงเดิม', storageIncrease: 'ปริมาณน้ำเพิ่มขึ้น', storageTrendUnavailable: 'ไม่มีข้อมูลเปรียบเทียบ',
});
Object.assign(messages.en, {
  storageDecrease: 'Storage decreased', storageSame: 'Storage about the same', storageIncrease: 'Storage increased', storageTrendUnavailable: 'No prior RID reading',
});
const stationEn = { 'บ้านหาดใหญ่': 'Ban Hat Yai', 'เทศบาลเมืองมาบตาพุด': 'Map Ta Phut Municipality', 'บ้านธรรมสถิตย์': 'Ban Tham Sathit', 'ชุมชนตากวน-อ่าวประดู่ เขตเทศบาลเมืองมาบตาพุต': 'Ta Kuan–Ao Pradu, Map Ta Phut', 'บริเวณศาลาร่วมใจพัฒนาเฉลิมพระเกียรติ ชุมชนสองพี่น้อง': 'Song Phi Nong community' };
let lang = (() => {
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'th') return requested;
  try { return localStorage.getItem('rayong-language') === 'en' ? 'en' : 'th'; } catch { return 'th'; }
})();
const t = key => messages[lang][key];
let latestSnapshot = null;
let latestHistory = null;
let snapshotFailed = false;
let historyFailed = false;
function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = lang === 'en' ? 'Rayong Flood Watch' : 'เฝ้าระวังน้ำระยอง | Rayong Flood Watch';
  for (const { node, html } of originalStatic) {
    const key = node.dataset.i18n || node.dataset.i18nHtml;
    if (lang === 'th') node.innerHTML = html;
    else if (node.dataset.i18nHtml) node.innerHTML = staticEn[key];
    else node.textContent = staticEn[key];
  }
  $('language').textContent = lang === 'th' ? 'English' : 'ไทย';
  $('language').setAttribute('aria-label', lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย');
}
const format = (value, digits = 2) => value === null || value === undefined ? '—' : Number(value).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const thaiDate = iso => {
  if (!iso) return t('noTime');
  const date = new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}+07:00`);
  return Number.isNaN(date.valueOf()) ? iso : new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-GB', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
};
const ageHours = iso => {
  if (!iso) return Infinity;
  const date = new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}+07:00`);
  return (Date.now() - date.valueOf()) / 3600_000;
};
const empty = message => `<div class="empty">${escapeHtml(message)}</div>`;

function renderGauges(items) {
  $('gauges').innerHTML = items.map(item => {
    if (!item) return empty(t('gaugeMissing'));
    const stale = ageHours(item.dateTime) > 3;
    const margin = item.belowBank;
    const status = stale ? [t('old'), 'muted'] : margin === null ? [t('bankUnknown'), 'muted'] : margin <= 0 ? [t('overBank'), 'danger'] : margin <= 0.5 ? [t('nearBank'), 'warn'] : [t('belowBank'), ''];
    const trend = item.previousLevel === null || item.waterLevel === null ? '—' : item.waterLevel > item.previousLevel ? t('rising') : item.waterLevel < item.previousLevel ? t('falling') : t('steady');
    const location = lang === 'en' ? item.subdistrictEn || item.subdistrict || item.district : item.subdistrict || item.district;
    const bankDistance = margin === null ? '—' : margin <= 0 ? `${t('above')} ${format(Math.abs(margin))} ${t('metres')}` : `${format(margin)} ${t('metres')}`;
    return `<article class="card gauge-card"><div class="card-top"><div><h3>${escapeHtml(t(item.key))}</h3><div class="card-sub">${escapeHtml(location || '')} · ${escapeHtml(item.stationCode || '')}</div></div><span class="pill ${status[1]}">${status[0]}</span></div><div class="metric"><strong>${format(item.waterLevel)}</strong><span>${t('msl')}</span></div><div class="mini-data"><div><small>${t('bankDistance')}</small><b>${bankDistance}</b></div><div><small>${t('previous')}</small><b>${trend}</b></div></div><p class="stamp">${t('measured')} ${thaiDate(item.dateTime)}${stale ? ` · ${t('delayed')}` : ''}</p></article>`;
  }).join('');
}

function renderReservoirs(items) {
  const classes = { nongPlaLai: '', dokKrai: 'green', khlongYai: 'orange' };
  $('reservoirs').innerHTML = items.map(item => {
    if (!item) return empty(t('reservoirMissing'));
    const percent = item.percent;
    const high = percent !== null && percent >= 100;
    const publicationNote = item.isFallback ? ` · ${t('waitingForToday')}` : '';
    const delta = item.previousPercent === undefined ? null : percent - item.previousPercent;
    const trend = delta === null ? { state: 'unknown', icon: '—', label: t('storageTrendUnavailable') } : delta < -0.1 ? { state: 'decrease', icon: '↘', label: t('storageDecrease') } : delta > 0.1 ? { state: 'increase', icon: '↗', label: t('storageIncrease') } : { state: 'same', icon: '→', label: t('storageSame') };
    const comparison = delta === null ? trend.label : `${trend.label} · ${t('comparedWith')} ${format(item.previousPercent, 1)}% (${item.previousPercentDate})`;
    return `<article class="card reservoir-card ${classes[item.key] || ''}"><div class="card-top"><div><h3>${lang === 'th' ? `${t('reservoir')}${escapeHtml(t(item.key))}` : `${escapeHtml(t(item.key))} ${t('reservoir')}`}</h3><div class="card-sub">RID ID ${escapeHtml(item.id)}</div></div><div class="percent-trend"><span class="pill ${high ? 'warn' : ''}">${percent === null ? '—' : `${format(percent, 1)}%`}</span><span class="reservoir-trend ${trend.state}" title="${escapeHtml(comparison)}" aria-label="${escapeHtml(comparison)}">${trend.icon}</span></div></div><div class="metric"><strong>${format(item.outflow, 3)}</strong><span>${t('outflow')}</span></div><div class="progress" aria-hidden="true"><span style="width:${Math.min(100, Math.max(0, percent || 0))}%"></span></div><div class="mini-data"><div><small>${t('storage')}</small><b>${format(item.volume, 2)} ${t('millionCubicMetres')}</b></div><div><small>${t('inflow')}</small><b>${format(item.inflow, 3)}</b></div></div><p class="stamp">${t('latestRidReading')} ${escapeHtml(item.date || '—')}${publicationNote} · <a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer">${t('source')}</a></p></article>`;
  }).join('');
}

function renderRainfall(items) {
  $('rainfall').innerHTML = items.length ? items.map(item => {
    const name = lang === 'en' ? item.nameEn || stationEn[item.name] || item.name : item.name;
    const subdistrict = lang === 'en' ? item.subdistrictEn || item.subdistrict || t('district') : item.subdistrict || t('district');
    const delta = item.previousAmount24h === undefined ? null : item.amount24h - item.previousAmount24h;
    const trend = delta === null ? { state: 'unknown', icon: '—', label: t('rainTrendUnavailable') } : delta < -0.1 ? { state: 'decrease', icon: '↘', label: t('rainDecrease') } : delta > 0.1 ? { state: 'increase', icon: '↗', label: t('rainIncrease') } : { state: 'same', icon: '→', label: t('rainSame') };
    const comparison = delta === null ? trend.label : `${trend.label} · ${t('comparedWith')} ${format(item.previousAmount24h, 1)} ${t('mm')} (${item.previousDate})`;
    return `<article class="card rain-card"><span class="rain-trend ${trend.state}" title="${escapeHtml(comparison)}" aria-label="${escapeHtml(comparison)}">${trend.icon}</span><div><h3>${escapeHtml(name)}</h3><div class="card-sub">${escapeHtml(subdistrict)}</div></div><div class="metric"><strong>${format(item.amount24h, 1)}</strong><span>${t('mm')}</span></div><p class="stamp">${thaiDate(item.dateTime)}${ageHours(item.dateTime) > 3 ? ` · ${t('old')}` : ''}</p></article>`;
  }).join('') : empty(t('rainMissing'));
}

function forecastDateTime(value) {
  return value ? thaiDate(`${value}:00+07:00`) : t('noTime');
}

function renderForecast(forecast) {
  const host = $('forecast');
  if (!forecast?.hours?.length) {
    host.innerHTML = empty(t('forecastMissing'));
    return;
  }
  const maxRain = Math.max(...forecast.hours.map(point => point.precipitation || 0));
  const bars = forecast.hours.map(point => {
    const amount = point.precipitation || 0;
    const chance = point.probability || 0;
    const height = maxRain ? Math.max(amount ? 4 : 2, Math.round(amount / maxRain * 112)) : 2;
    const opacity = Math.max(.2, Math.min(1, chance / 100));
    const label = `${forecastDateTime(point.dateTime)} · ${format(amount, 1)} ${t('mm')} · ${format(chance, 0)}%`;
    return `<span class="forecast-bar" style="height:${height}px;--chance:${opacity}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}"></span>`;
  }).join('');
  const peak = forecast.peakPrecipitation > 0 ? `${format(forecast.peakPrecipitation, 1)} ${t('mm')} ${t('at')} ${forecastDateTime(forecast.peakTime)}` : t('noRainExpected');
  const start = forecast.hours[0]?.dateTime;
  const end = forecast.hours.at(-1)?.dateTime;
  host.innerHTML = `<div class="forecast-summary"><div class="forecast-stat"><small>${t('forecastTotal')}</small><strong>${format(forecast.total, 1)} ${t('mm')}</strong><span>${lang === 'th' ? 'จุดกึ่งกลางตัวเมืองระยอง' : 'near central Rayong'}</span></div><div class="forecast-stat"><small>${t('peakChance')}</small><strong>${format(forecast.peakProbability, 0)}%</strong><span>${lang === 'th' ? 'ค่ารายชั่วโมงสูงสุด' : 'highest hourly value'}</span></div><div class="forecast-stat"><small>${t('heaviestHour')}</small><strong>${forecast.peakPrecipitation > 0 ? `${format(forecast.peakPrecipitation, 1)} ${t('mm')}` : '—'}</strong><span>${escapeHtml(peak)}</span></div></div><div class="forecast-bars" role="img" aria-label="${escapeHtml(`${t('forecastTotal')}: ${format(forecast.total, 1)} ${t('mm')}`)}">${bars}</div><div class="forecast-times"><span>${escapeHtml(forecastDateTime(start))}</span><span>${escapeHtml(forecastDateTime(end))}</span></div><p class="forecast-stamp">${t('forecastStarts')} ${escapeHtml(forecastDateTime(start))} · <a href="${escapeHtml(forecast.source)}" target="_blank" rel="noopener noreferrer">${t('forecastSource')}</a></p>`;
}

function svgGrid(min, max, formatY) {
  const steps = [0, 0.5, 1];
  return steps.map(t => {
    const y = 180 - t * 150;
    const value = min + (max - min) * t;
    return `<line x1="40" x2="485" y1="${y}" y2="${y}" stroke="#e8eff0"/><text x="32" y="${y + 4}" text-anchor="end" fill="#91a5ad" font-size="10">${formatY(value)}</text>`;
  }).join('');
}

function renderGaugeChart(points, bank) {
  const host = $('gauge-chart');
  const recent = (points || []).filter(point => ageHours(point.dateTime) <= 48 && ageHours(point.dateTime) >= -1 && Number.isFinite(point.level));
  if (recent.length < 2) { host.textContent = t('noGaugeHistory'); return; }
  const values = recent.map(point => point.level);
  let min = Math.min(...values, bank ?? Infinity);
  let max = Math.max(...values, bank ?? -Infinity);
  const padding = Math.max(0.2, (max - min) * 0.12);
  min -= padding; max += padding;
  const first = new Date(`${recent[0].dateTime.replace(' ', 'T')}+07:00`).valueOf();
  const last = new Date(`${recent.at(-1).dateTime.replace(' ', 'T')}+07:00`).valueOf();
  const x = point => 40 + 445 * (new Date(`${point.dateTime.replace(' ', 'T')}+07:00`).valueOf() - first) / Math.max(1, last - first);
  const y = value => 180 - 150 * (value - min) / (max - min);
  const line = recent.map((point, index) => `${index ? 'L' : 'M'}${x(point).toFixed(1)},${y(point.level).toFixed(1)}`).join(' ');
  const bankLine = bank === null ? '' : `<line x1="40" x2="485" y1="${y(bank).toFixed(1)}" y2="${y(bank).toFixed(1)}" stroke="#df8f69" stroke-width="1.5" stroke-dasharray="5 4"/><text x="485" y="${(y(bank)-5).toFixed(1)}" text-anchor="end" fill="#be7959" font-size="10">${t('bankLine')}</text>`;
  host.innerHTML = `<svg viewBox="0 0 500 215" role="img" aria-label="${t('gaugeChartAlt')}">${svgGrid(min, max, v => format(v, 1))}${bankLine}<path d="${line}" fill="none" stroke="#069b9a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(recent.at(-1)).toFixed(1)}" cy="${y(recent.at(-1).level).toFixed(1)}" r="4" fill="#069b9a"/><text x="40" y="207" fill="#91a5ad" font-size="10">${escapeHtml(thaiDate(recent[0].dateTime))}</text><text x="485" y="207" text-anchor="end" fill="#91a5ad" font-size="10">${escapeHtml(thaiDate(recent.at(-1).dateTime))}</text></svg>`;
}

function renderReleaseChart(days) {
  const host = $('release-chart');
  if (!days?.length || !days.some(day => ['nongPlaLai', 'dokKrai', 'khlongYai'].some(key => day[key] !== null && day[key] !== undefined))) { host.textContent = t('noReleaseHistory'); return; }
  const keys = ['nongPlaLai', 'dokKrai', 'khlongYai'];
  const colors = ['#3475c9', '#53a883', '#e99e4c'];
  const max = Math.max(0.1, ...days.flatMap(day => keys.map(key => day[key] || 0)));
  const bars = days.flatMap((day, index) => keys.map((key, series) => {
    const value = day[key];
    if (value === null || value === undefined) return '';
    const height = Math.max(value > 0 ? 2 : 0, 150 * value / max);
    const x = 50 + index * 62 + series * 14;
    return `<rect x="${x}" y="${180 - height}" width="11" height="${height}" rx="2" fill="${colors[series]}"><title>${escapeHtml(day.date)} · ${escapeHtml(t(key))}: ${format(value, 3)}</title></rect>`;
  })).join('');
  const ticks = days.map((day, index) => `<text x="${66 + index * 62}" y="207" text-anchor="middle" fill="#91a5ad" font-size="10">${escapeHtml(day.date?.slice(5) || '')}</text>`).join('');
  host.innerHTML = `<svg viewBox="0 0 500 215" role="img" aria-label="${t('releaseChartAlt')}">${svgGrid(0, max, v => format(v, 1))}${bars}${ticks}</svg>`;
}

async function getJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function renderCurrent() {
  if (latestSnapshot) {
    renderGauges(latestSnapshot.gauges);
    renderReservoirs(latestSnapshot.reservoirs);
    renderRainfall(latestSnapshot.rainfall);
    renderForecast(latestSnapshot.forecast);
    $('updated').textContent = `${t('fetched')} ${thaiDate(latestSnapshot.fetchedAt)}`;
    $('footer-time').textContent = `${t('fetchedShort')} ${thaiDate(latestSnapshot.fetchedAt)}`;
    const failures = Object.keys(latestSnapshot.errors || {});
    $('connection').textContent = failures.length ? `${t('partial')} (${failures.length})` : t('connected');
    $('connection').classList.toggle('error', !!failures.length);
  } else if (snapshotFailed) {
    $('gauges').innerHTML = empty(t('gaugeError'));
    $('reservoirs').innerHTML = empty(t('reservoirError'));
    $('rainfall').innerHTML = empty(t('rainError'));
    $('forecast').innerHTML = empty(t('forecastMissing'));
    $('connection').textContent = t('disconnected');
    $('connection').classList.add('error');
  } else {
    $('updated').textContent = t('contacting');
  }
  if (latestHistory) {
    renderGaugeChart(latestHistory.gauges.nongBua, latestSnapshot?.gauges[0]?.bankLevel ?? null);
    renderReleaseChart(latestHistory.releases);
  } else {
    $('gauge-chart').textContent = t(historyFailed ? 'historyError' : 'chartLoading');
    $('release-chart').textContent = t(historyFailed ? 'historyError' : 'chartLoading');
  }
}

let loading = false;
async function load() {
  if (loading) return;
  loading = true;
  $('refresh').disabled = true;
  $('connection').textContent = t('updating');
  $('connection').classList.remove('error');
  const [snapshot, history] = await Promise.allSettled([getJson('/api/snapshot'), getJson('/api/history')]);
  if (snapshot.status === 'fulfilled') {
    latestSnapshot = snapshot.value;
    snapshotFailed = false;
  } else {
    snapshotFailed = !latestSnapshot;
  }
  if (history.status === 'fulfilled') {
    latestHistory = history.value;
    historyFailed = false;
  } else {
    historyFailed = !latestHistory;
  }
  renderCurrent();
  $('refresh').disabled = false;
  loading = false;
}

$('refresh').addEventListener('click', load);
$('language').addEventListener('click', () => {
  lang = lang === 'th' ? 'en' : 'th';
  try { localStorage.setItem('rayong-language', lang); } catch { /* Storage may be unavailable. */ }
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) {
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }
  applyLanguage();
  renderCurrent();
});
applyLanguage();
load();
setInterval(load, 5 * 60_000);
