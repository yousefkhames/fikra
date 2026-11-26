(function (root) {
  'use strict';
  var STATUSES = ['idea', 'script', 'filmed', 'posted'];
  var PLATFORMS = ['shorts', 'reels', 'tiktok'];

  var TEMPLATES = [
    { id: 't1', cat: 'curiosity', ar: 'ما لا يخبرك به أحد عن {x}', en: "What nobody tells you about {x}" },
    { id: 't2', cat: 'curiosity', ar: 'السر الحقيقي وراء {x}', en: 'The real secret behind {x}' },
    { id: 't3', cat: 'curiosity', ar: 'لماذا {x} ليس كما تظن؟', en: "Why {x} isn't what you think" },
    { id: 't4', cat: 'curiosity', ar: 'شيء غريب عن {x} لن تصدقه', en: "A weird thing about {x} you won't believe" },
    { id: 't5', cat: 'mistake', ar: '٣ أخطاء تدمّر {x}', en: '3 mistakes that ruin {x}' },
    { id: 't6', cat: 'mistake', ar: 'توقف عن فعل هذا في {x}', en: 'Stop doing this with {x}' },
    { id: 't7', cat: 'mistake', ar: 'أكبر غلطة يقع فيها المبتدئ في {x}', en: 'The biggest beginner mistake in {x}' },
    { id: 't8', cat: 'how', ar: 'كيف تتعلم {x} في ٣٠ يوماً', en: 'How to learn {x} in 30 days' },
    { id: 't9', cat: 'how', ar: 'طريقة بسيطة لـ{x} بدون تعقيد', en: 'A simple way to {x} with no fuss' },
    { id: 't10', cat: 'how', ar: 'خطوة بخطوة: {x} في ٦٠ ثانية', en: 'Step by step: {x} in 60 seconds' },
    { id: 't11', cat: 'story', ar: 'جرّبت {x} لمدة أسبوع، وهذا ما حدث', en: 'I tried {x} for a week, here is what happened' },
    { id: 't12', cat: 'story', ar: 'قبل سنة لم أكن أعرف شيئاً عن {x}', en: 'A year ago I knew nothing about {x}' },
    { id: 't13', cat: 'story', ar: 'القصة التي لم تُروَ عن {x}', en: 'The untold story of {x}' },
    { id: 't14', cat: 'list', ar: '٥ أدوات مجانية لـ{x}', en: '5 free tools for {x}' },
    { id: 't15', cat: 'list', ar: 'أفضل ٣ نصائح في {x}', en: 'Top 3 tips for {x}' },
    { id: 't16', cat: 'list', ar: '١٠ حقائق سريعة عن {x}', en: '10 quick facts about {x}' },
    { id: 't17', cat: 'contrast', ar: '{x}: الفرق بين المبتدئ والمحترف', en: '{x}: beginner vs pro' },
    { id: 't18', cat: 'contrast', ar: 'الطريقة القديمة مقابل الجديدة في {x}', en: 'Old way vs new way in {x}' },
    { id: 't19', cat: 'contrast', ar: 'هل {x} يستحق فعلاً؟', en: 'Is {x} actually worth it?' },
    { id: 't20', cat: 'challenge', ar: 'تحدّي: {x} بدون ميزانية', en: 'Challenge: {x} with zero budget' },
    { id: 't21', cat: 'challenge', ar: 'هل تستطيع إكمال {x} قبل انتهاء الفيديو؟', en: 'Can you finish {x} before this video ends?' },
    { id: 't22', cat: 'question', ar: 'هل تعلم هذا عن {x}؟', en: 'Did you know this about {x}?' },
    { id: 't23', cat: 'question', ar: 'ماذا لو اختفى {x} غداً؟', en: 'What if {x} disappeared tomorrow?' },
    { id: 't24', cat: 'question', ar: 'لو كنت أبدأ {x} من جديد، سأفعل هذا', en: 'If I started {x} again, I would do this' }
  ];
  var CATS = ['curiosity', 'mistake', 'how', 'story', 'list', 'contrast', 'challenge', 'question'];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function parseYmd(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3];
    var dt = new Date(Date.UTC(y, mo, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo || dt.getUTCDate() !== d) return null;
    return { y: y, m: mo, d: d };
  }
  function daysInMonth(y, m) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); }
  // weekday of the 1st, with weekStart (0 = Sunday, 6 = Saturday)
  function monthGrid(y, m, weekStart) {
    weekStart = weekStart == null ? 6 : weekStart;
    var first = new Date(Date.UTC(y, m, 1)).getUTCDay();
    var lead = (first - weekStart + 7) % 7;
    var cells = [];
    for (var i = 0; i < lead; i++) cells.push(null);
    for (var d = 1; d <= daysInMonth(y, m); d++) cells.push(ymd(y, m, d));
    while (cells.length % 7) cells.push(null);
    return cells;
  }
  function fillTemplate(tpl, topic, lang) {
    var t = (lang === 'ar' ? tpl.ar : tpl.en);
    topic = String(topic || '').trim();
    return t.replace(/\{x\}/g, topic || '…');
  }
  function sanitizeIdea(o) {
    o = o || {};
    var s = function (v, n) { return String(v == null ? '' : v).slice(0, n); };
    var title = s(o.title, 120).trim();
    var idea = {
      id: s(o.id, 40) || ('i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
      title: title,
      hook: s(o.hook, 300).trim(),
      notes: s(o.notes, 2000),
      tag: s(o.tag, 30).trim(),
      platform: PLATFORMS.indexOf(o.platform) >= 0 ? o.platform : 'shorts',
      status: STATUSES.indexOf(o.status) >= 0 ? o.status : 'idea',
      date: parseYmd(o.date) ? o.date : '',
      star: !!o.star,
      created: typeof o.created === 'number' ? o.created : Date.now()
    };
    return idea;
  }
  function validIdea(i) { return !!(i && i.title && i.title.trim().length > 0); }
  function filterIdeas(list, f) {
    f = f || {};
    var q = (f.q || '').trim().toLowerCase();
    return list.filter(function (i) {
      if (f.status && f.status !== 'all' && i.status !== f.status) return false;
      if (f.tag && f.tag !== 'all' && i.tag !== f.tag) return false;
      if (f.star && !i.star) return false;
      if (q && (i.title + ' ' + i.hook + ' ' + i.notes + ' ' + i.tag).toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).sort(function (a, b) {
      if (f.sort === 'date') return (a.date || '9999') < (b.date || '9999') ? -1 : 1;
      return b.created - a.created;
    });
  }
  function stats(list) {
    var r = { total: list.length, idea: 0, script: 0, filmed: 0, posted: 0, scheduled: 0, starred: 0, pct: 0 };
    list.forEach(function (i) { r[i.status]++; if (i.date) r.scheduled++; if (i.star) r.starred++; });
    r.pct = list.length ? Math.round(r.posted * 100 / list.length) : 0;
    return r;
  }
  function tagsOf(list) {
    var seen = {};
    list.forEach(function (i) { if (i.tag) seen[i.tag] = 1; });
    return Object.keys(seen).sort();
  }
  function nextStatus(s) { return STATUSES[Math.min(STATUSES.indexOf(s) + 1, STATUSES.length - 1)]; }
  // consecutive-day posting streak ending today or yesterday
  function streak(list, todayStr) {
    var days = {};
    list.forEach(function (i) { if (i.status === 'posted' && i.date) days[i.date] = 1; });
    var t = parseYmd(todayStr); if (!t) return 0;
    var cur = Date.UTC(t.y, t.m, t.d);
    var fmt = function (ms) { var d = new Date(ms); return ymd(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); };
    if (!days[fmt(cur)]) cur -= 86400000;
    var n = 0;
    while (days[fmt(cur)]) { n++; cur -= 86400000; }
    return n;
  }
  function esc(s) { return String(s).replace(/\r?\n/g, '\\n').replace(/([,;\\])/g, '\\$1'); }
  // RFC 5545: lines are folded at 75 octets (UTF-8), never inside a multi-byte character
  function fold(line) {
    var out = [], cur = '', bytes = 0, limit = 75;
    Array.from(line).forEach(function (ch) {
      var n = unescape(encodeURIComponent(ch)).length;
      if (bytes + n > limit) { out.push(cur); cur = ' ' + ch; bytes = 1 + n; limit = 75; } else { cur += ch; bytes += n; }
    });
    out.push(cur);
    return out.join('\r\n');
  }
  function toICS(list) {
    var out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fikra//EN', 'CALSCALE:GREGORIAN'];
    list.filter(function (i) { return i.date; }).forEach(function (i) {
      var p = parseYmd(i.date);
      var next = new Date(Date.UTC(p.y, p.m, p.d + 1));
      var nd = ymd(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate()).replace(/-/g, '');
      out.push('BEGIN:VEVENT', 'UID:' + i.id + '@fikra', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ''),
        'DTSTART;VALUE=DATE:' + i.date.replace(/-/g, ''), 'DTEND;VALUE=DATE:' + nd,
        'SUMMARY:' + esc(i.title), 'DESCRIPTION:' + esc((i.hook ? i.hook + '\n' : '') + (i.notes || '')), 'END:VEVENT');
    });
    out.push('END:VCALENDAR');
    return out.map(fold).join('\r\n') + '\r\n';
  }
  function csvCell(v) { v = String(v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }
  function toCSV(list) {
    var head = ['title', 'hook', 'tag', 'platform', 'status', 'date', 'notes'];
    var rows = [head.join(',')];
    list.forEach(function (i) { rows.push(head.map(function (k) { return csvCell(i[k]); }).join(',')); });
    return rows.join('\n');
  }
  function importJSON(text) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return { ok: false, error: 'parse' }; }
    var arr = Array.isArray(data) ? data : (data && Array.isArray(data.ideas) ? data.ideas : null);
    if (!arr) return { ok: false, error: 'shape' };
    var ideas = arr.map(sanitizeIdea).filter(validIdea);
    return { ok: true, ideas: ideas, skipped: arr.length - ideas.length };
  }
  function mergeIdeas(cur, add) {
    var ids = {}; cur.forEach(function (i) { ids[i.id] = 1; });
    var out = cur.slice(), n = 0;
    add.forEach(function (i) { if (!ids[i.id]) { out.push(i); ids[i.id] = 1; n++; } });
    return { list: out, added: n };
  }
  var api = { STATUSES: STATUSES, PLATFORMS: PLATFORMS, TEMPLATES: TEMPLATES, CATS: CATS, ymd: ymd, parseYmd: parseYmd, daysInMonth: daysInMonth,
    monthGrid: monthGrid, fillTemplate: fillTemplate, sanitizeIdea: sanitizeIdea, validIdea: validIdea, filterIdeas: filterIdeas,
    stats: stats, tagsOf: tagsOf, nextStatus: nextStatus, streak: streak, toICS: toICS, toCSV: toCSV, importJSON: importJSON, mergeIdeas: mergeIdeas };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FikraLogic = api;
})(typeof self !== 'undefined' ? self : this);
