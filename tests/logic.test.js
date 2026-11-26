const test = require('node:test');
const assert = require('node:assert');
const L = require('../logic.js');

test('parseYmd validates real dates', () => {
  assert.deepStrictEqual(L.parseYmd('2026-02-28'), { y: 2026, m: 1, d: 28 });
  assert.strictEqual(L.parseYmd('2026-02-30'), null);
  assert.strictEqual(L.parseYmd('nope'), null);
  assert.strictEqual(L.parseYmd(''), null);
});
test('monthGrid is a whole number of weeks and starts on the right day', () => {
  const g = L.monthGrid(2026, 10, 1); // Nov 2026, Monday start: Nov 1 is Sunday -> 6 blanks
  assert.strictEqual(g.length % 7, 0);
  assert.strictEqual(g.filter(Boolean).length, 30);
  assert.strictEqual(g.indexOf('2026-11-01'), 6);
  const s = L.monthGrid(2026, 10, 6); // Saturday start -> 1 blank
  assert.strictEqual(s.indexOf('2026-11-01'), 1);
  assert.strictEqual(L.monthGrid(2028, 1, 1).filter(Boolean).length, 29);
});
test('templates: 24, bilingual, each has a placeholder', () => {
  assert.strictEqual(L.TEMPLATES.length, 24);
  L.TEMPLATES.forEach(t => { assert.ok(t.ar.includes('{x}') && t.en.includes('{x}')); assert.ok(L.CATS.includes(t.cat)); });
});
test('fillTemplate fills topic, falls back to ellipsis', () => {
  const t = L.TEMPLATES[0];
  assert.ok(L.fillTemplate(t, ' coffee ', 'en').includes('coffee'));
  assert.ok(L.fillTemplate(t, '', 'ar').includes('…'));
  assert.ok(!L.fillTemplate(t, 'x', 'en').includes('{x}'));
});
test('sanitizeIdea clamps and defaults', () => {
  const i = L.sanitizeIdea({ title: ' hi ', platform: 'bad', status: 'bad', date: '2026-13-01', tag: 'a'.repeat(99) });
  assert.strictEqual(i.title, 'hi'); assert.strictEqual(i.platform, 'shorts'); assert.strictEqual(i.status, 'idea');
  assert.strictEqual(i.date, ''); assert.strictEqual(i.tag.length, 30); assert.ok(i.id);
  assert.ok(!L.validIdea(L.sanitizeIdea({ title: '   ' })));
});
test('filterIdeas by text, status, tag, star', () => {
  const l = [L.sanitizeIdea({ id: 'a', title: 'Coffee tips', status: 'idea', tag: 'life', star: true, created: 1 }),
    L.sanitizeIdea({ id: 'b', title: 'Edit', status: 'posted', tag: 'work', created: 2 })];
  assert.strictEqual(L.filterIdeas(l, { q: 'COFFEE' }).length, 1);
  assert.strictEqual(L.filterIdeas(l, { status: 'posted' })[0].id, 'b');
  assert.strictEqual(L.filterIdeas(l, { tag: 'life' })[0].id, 'a');
  assert.strictEqual(L.filterIdeas(l, { star: true }).length, 1);
  assert.strictEqual(L.filterIdeas(l, {})[0].id, 'b');
});
test('stats and nextStatus', () => {
  const l = [{ status: 'posted', date: '2026-01-01', star: true }, { status: 'idea', date: '', star: false }];
  const s = L.stats(l); assert.strictEqual(s.pct, 50); assert.strictEqual(s.scheduled, 1); assert.strictEqual(s.starred, 1);
  assert.strictEqual(L.stats([]).pct, 0);
  assert.strictEqual(L.nextStatus('idea'), 'script'); assert.strictEqual(L.nextStatus('posted'), 'posted');
});
test('streak counts consecutive posted days', () => {
  const p = d => ({ status: 'posted', date: d });
  assert.strictEqual(L.streak([p('2026-11-24'), p('2026-11-25'), p('2026-11-26')], '2026-11-26'), 3);
  assert.strictEqual(L.streak([p('2026-11-24'), p('2026-11-25')], '2026-11-26'), 2);
  assert.strictEqual(L.streak([p('2026-11-20')], '2026-11-26'), 0);
  assert.strictEqual(L.streak([p('2026-02-27'), p('2026-02-28'), p('2026-03-01')], '2026-03-01'), 3);
});
test('ICS has events, escapes text, DTEND is next day', () => {
  const ics = L.toICS([{ id: 'x1', title: 'A, B', hook: 'h', notes: '', date: '2026-12-31' }, { id: 'x2', title: 'no date', date: '' }]);
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20261231')); assert.ok(ics.includes('DTEND;VALUE=DATE:20270101'));
  assert.ok(ics.includes('SUMMARY:A\\, B')); assert.strictEqual((ics.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
test('CSV quotes and neutralises formulas', () => {
  const c = L.toCSV([{ title: '=SUM(1)', hook: 'say "hi"', tag: '', platform: 'shorts', status: 'idea', date: '', notes: 'a\nb' }]);
  assert.ok(c.includes('"\'=SUM(1)"')); assert.ok(c.includes('"say ""hi"""'));
});
test('importJSON handles array, wrapper, junk', () => {
  assert.strictEqual(L.importJSON('{bad').ok, false);
  assert.strictEqual(L.importJSON('{"a":1}').ok, false);
  const r = L.importJSON(JSON.stringify({ ideas: [{ title: 'ok' }, { title: '' }, { foo: 1 }] }));
  assert.ok(r.ok); assert.strictEqual(r.ideas.length, 1); assert.strictEqual(r.skipped, 2);
  assert.strictEqual(L.importJSON('[{"title":"x"}]').ideas.length, 1);
});
test('mergeIdeas skips duplicate ids', () => {
  const a = [{ id: '1' }], m = L.mergeIdeas(a, [{ id: '1' }, { id: '2' }]);
  assert.strictEqual(m.added, 1); assert.strictEqual(m.list.length, 2);
});
