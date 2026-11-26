// Real-browser click-through. Usage: node tests/e2e.js <baseUrl> [screenshotDir]
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');
const assert = require('node:assert');
const base = process.argv[2], shots = process.argv[3];
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, 'language', { get: () => 'ar-EG' }));
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  await page.setViewport({ width: 400, height: 860, deviceScaleFactor: 2, isMobile: true });
  await page.goto(base, { waitUntil: 'networkidle0' });
  const txt = sel => page.$eval(sel, e => e.textContent);
  const count = sel => page.$$eval(sel, e => e.length);
  const log = m => console.log('ok -', m);

  assert.strictEqual(await page.$eval('html', e => e.dir), 'rtl'); log('starts RTL Arabic');
  assert.strictEqual(await count('.card'), 0); log('empty state');
  await page.click('#sampleBtn'); assert.strictEqual(await count('.card'), 6); log('sample data loads 6');
  if (shots) await page.screenshot({ path: shots + '/ideas-mobile-ar.png' });

  // add idea through the editor, with an XSS-looking title that must stay text
  await page.click('#addBtn'); await page.type('#editForm [name=title]', '<img src=x onerror=window.__pwn=1>');
  await page.type('#editForm [name=hook]', 'hook A'); await page.type('#editForm [name=tag]', 'test');
  await page.click('#editForm button[type=submit]');
  assert.strictEqual(await count('.card'), 7); assert.strictEqual(await page.evaluate(() => window.__pwn), undefined); log('add idea, no HTML injection');
  // search
  await page.type('#q', 'hook A'); assert.strictEqual(await count('.card'), 1); await page.$eval('#q', e => { e.value = ''; e.dispatchEvent(new Event('input')); });
  // advance status
  await page.type('#q', 'hook A'); await page.click('.card .next'); assert.strictEqual(await page.$eval('.card .pill', e => e.textContent), 'سيناريو'); log('status advance');
  // edit
  await page.click('.card .edit'); await page.$eval('#editForm [name=title]', e => e.value = 'Edited title'); await page.click('#editForm button[type=submit]');
  assert.ok((await txt('.card h3')).includes('Edited')); log('edit');
  // delete
  await page.click('.card .del'); await page.$eval('#q', e => { e.value = ''; e.dispatchEvent(new Event('input')); }); assert.strictEqual(await count('.card'), 6); log('delete');
  // star filter
  await page.click('#fStar'); const stars = await count('.card'); assert.ok(stars >= 1 && stars < 6); await page.click('#fStar'); log('star filter');

  // language switch
  await page.click('#langBtn'); assert.strictEqual(await page.$eval('html', e => e.dir), 'ltr'); assert.ok((await txt('#addBtn')).includes('New idea')); log('switch to English LTR');
  // hooks
  await page.click('#tab-hooks'); await page.type('#topic', 'coffee');
  assert.strictEqual(await count('.hook-card'), 24); assert.ok((await txt('.hook-card q')).includes('coffee')); log('24 hooks filled with topic');
  await page.click('[data-cat=mistake]'); assert.strictEqual(await count('.hook-card'), 3); log('category filter');
  await page.click('.hook-card .use'); await page.click('#tab-ideas'); assert.strictEqual(await count('.card'), 7); log('hook becomes idea');
  if (shots) { await page.click('#tab-hooks'); await page.click('[data-cat=all]'); await page.screenshot({ path: shots + '/hooks-mobile-en.png' }); }
  // calendar
  await page.click('#tab-cal'); assert.ok(await count('.day:not(.blank)') >= 28); assert.ok(await count('.day .dot') >= 1); log('calendar renders with scheduled ideas');
  await page.click('.day.today'); assert.ok(await page.$eval('#dayDlg', d => d.open));
  await page.type('#dayNew', 'Calendar quick add'); await page.click('#dayAdd');
  assert.ok((await txt('#dayBody')).includes('Calendar quick add')); log('quick add on a day');
  await page.select('#daySel', await page.$eval('#daySel option:nth-child(2)', o => o.value)); log('schedule existing idea');
  await page.click('.dlist .unsched'); await page.click('#dayClose');
  await page.click('#nextM'); await page.click('#prevM'); log('month nav');
  if (shots) await page.screenshot({ path: shots + '/calendar-mobile-en.png' });
  // persistence
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('fikra.v1')).ideas.length);
  await page.reload({ waitUntil: 'networkidle0' });
  assert.strictEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('fikra.v1')).ideas.length), before);
  assert.strictEqual(await page.$eval('html', e => e.lang), 'en'); log('persists across reload incl. language');
  // theme
  await page.click('#themeBtn'); assert.strictEqual(await page.$eval('html', e => e.dataset.theme), 'light'); log('light theme');
  // corrupt storage must not break the app
  await page.evaluate(() => localStorage.setItem('fikra.v1', '{broken')); await page.reload({ waitUntil: 'networkidle0' });
  assert.strictEqual(await count('.card'), 0); log('survives corrupted storage');
  // import
  await page.click('#tab-ideas');
  await page.evaluate(() => { const i = document.querySelector('#impFile'); const dt = new DataTransfer(); dt.items.add(new File([JSON.stringify([{ title: 'Imported one' }, { title: 'Imported two' }])], 'x.json')); i.files = dt.files; i.dispatchEvent(new Event('change')); });
  await sleep(300); assert.strictEqual(await count('.card'), 2); log('JSON import');
  // wipe
  await page.click('#wipeBtn'); assert.strictEqual(await count('.card'), 0); log('wipe');
  // offline: service worker serves the app with no network
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => navigator.serviceWorker.ready); await sleep(500); await page.reload({ waitUntil: 'networkidle0' });
  await page.setOfflineMode(true); await page.reload({ waitUntil: 'domcontentloaded' });
  assert.ok(await count('#addBtn') === 1 && await page.evaluate(() => !!window.FikraLogic)); log('works offline via service worker');
  await page.setOfflineMode(false);
  // desktop layout
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'networkidle0' });
  await page.click('#sampleBtn');
  const sw = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth); assert.ok(sw); log('no horizontal overflow desktop');
  await page.setViewport({ width: 360, height: 700, isMobile: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)); log('no horizontal overflow at 360px');
  if (shots) { await page.setViewport({ width: 1280, height: 800 }); await page.screenshot({ path: shots + '/ideas-desktop.png' }); }
  assert.deepStrictEqual(errors, [], 'console errors: ' + errors.join('|'));
  log('no console errors');
  await browser.close();
  console.log('E2E PASSED');
})().catch(e => { console.error('E2E FAILED', e); process.exit(1); });
