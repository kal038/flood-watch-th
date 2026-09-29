import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSnapshot, number } from './server.js';

test('keeps missing readings null and selects the intended reservoir and gauge IDs', () => {
  const data = normalizeSnapshot({
    dam: { date: '2026-09-29', data: [{ dam: [{ id: '100504', storage: 163.75, volume: 144.47, outflow: 0.43 }] }] },
    reservoir: { date: '2026-09-29', data: [{ reservoir: [{ id: 'rsv357', outflow: null }, { id: 'rsv359', outflow: 1.817 }] }] },
    waterlevel: { data: [
      { station: { id: 118, min_bank: 15.97 }, waterlevel_msl: '16.22', waterlevel_datetime: '2026-09-29 22:00' },
      { station: { id: 505011, min_bank: 10.6 }, waterlevel_msl: '9.90', waterlevel_datetime: '2026-09-29 22:00' },
    ] },
    rainfall: { data: [
      { rain_24h: 20, geocode: { amphoe_code: '01' }, station: { tele_station_name: { th: 'เมือง' } } },
      { rain_24h: 90, geocode: { amphoe_code: '05' }, station: { tele_station_name: { th: 'บ้านค่าย' } } },
    ] },
  });
  assert.deepEqual(data.reservoirs.map(item => item?.id), ['100504', 'rsv357', 'rsv359']);
  assert.equal(data.reservoirs[1].outflow, null);
  assert.equal(data.gauges[0].belowBank, -0.25);
  assert.equal(data.gauges[1].belowBank, 0.7);
  assert.deepEqual(data.rainfall.map(item => item.name), ['เมือง']);
  assert.equal(number(null), null);
});

test('uses the previous RID record only when today has no operational reservoir readings', () => {
  const data = normalizeSnapshot({
    dam: { date: '2026-09-30', data: [{ dam: [{ id: '100504', storage: 163.75, volume: null, outflow: null, inflow: null, percent_storage: null }] }] },
    reservoir: { date: '2026-09-30', data: [{ reservoir: [{ id: 'rsv357', storage: 71.4, volume: null, outflow: null }, { id: 'rsv359', storage: 50.8, volume: null, outflow: null }] }] },
  }, {
    dam: { date: '2026-09-29', data: [{ dam: [{ id: '100504', volume: 144.47, outflow: 0.43, inflow: 10.05, percent_storage: 88.23 }] }] },
    reservoir: { date: '2026-09-29', data: [{ reservoir: [{ id: 'rsv357', volume: 86.891, outflow: 1.985 }, { id: 'rsv359', volume: 53.353, outflow: 1.817 }] }] },
  });
  assert.deepEqual(data.reservoirs.map(item => item.date), ['2026-09-29', '2026-09-29', '2026-09-29']);
  assert.deepEqual(data.reservoirs.map(item => item.isFallback), [true, true, true]);
  assert.equal(data.reservoirs[1].outflow, 1.985);
});
