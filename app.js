(function () {
  'use strict';
  var L = window.FikraLogic;
  var KEY = 'fikra.v1';
  var $ = function (s) { return document.querySelector(s); };

  var T = {
    ar: {
      brand: 'فكرة', tagline: 'بنك أفكار الفيديو القصير', tab_ideas: 'الأفكار', tab_hooks: 'الجُمل الافتتاحية', tab_cal: 'التقويم',
      add_idea: '+ فكرة جديدة', search: 'ابحث في الأفكار…', all_status: 'كل الحالات', all_tags: 'كل الوسوم',
      st_idea: 'فكرة', st_script: 'سيناريو', st_filmed: 'تم التصوير', st_posted: 'تم النشر',
      pf_shorts: 'Shorts', pf_reels: 'Reels', pf_tiktok: 'TikTok',
      s_total: 'الكل', s_scheduled: 'مجدولة', s_posted: 'منشورة', s_pct: 'نسبة الإنجاز', s_streak: 'أيام متتالية',
      exp_json: 'تصدير JSON', exp_csv: 'تصدير CSV', imp_json: 'استيراد JSON', wipe: 'مسح كل شيء', exp_ics: 'تصدير التقويم (ICS)',
      empty_t: 'لا توجد أفكار بعد. ابدأ بفكرة أو جرّب بيانات تجريبية.', sample: 'حمّل أمثلة', none_match: 'لا توجد نتائج مطابقة.',
      topic_label: 'موضوعك', topic_ph: 'مثال: المونتاج، القهوة، الذكاء الاصطناعي', shuffle: 'اخلط الجُمل',
      cat_all: 'الكل', cat_curiosity: 'فضول', cat_mistake: 'أخطاء', cat_how: 'كيف', cat_story: 'قصة', cat_list: 'قوائم', cat_contrast: 'مقارنة', cat_challenge: 'تحدّي', cat_question: 'سؤال',
      use_hook: 'حوّلها لفكرة', copy: 'نسخ', copied: 'تم النسخ', today: 'اليوم', cal_hint: 'اضغط على أي يوم لجدولة فكرة أو إضافة فكرة جديدة.',
      foot: 'تعمل بدون إنترنت. بياناتك محفوظة في هذا المتصفح فقط.',
      f_title: 'العنوان', f_hook: 'الجملة الافتتاحية (أول ٣ ثوانٍ)', f_tag: 'وسم', f_date: 'تاريخ النشر', f_platform: 'المنصة', f_status: 'الحالة', f_notes: 'ملاحظات', f_star: 'مفضّلة',
      cancel: 'إلغاء', save: 'حفظ', close: 'إغلاق', new_t: 'فكرة جديدة', edit_t: 'تعديل الفكرة', edit: 'تعديل', del: 'حذف', next: 'التالي ←',
      confirm_del: 'حذف هذه الفكرة؟', confirm_wipe: 'سيتم مسح كل الأفكار من هذا المتصفح. متأكد؟', saved: 'تم الحفظ', deleted: 'تم الحذف',
      imported: 'تمت إضافة {n} فكرة', imp_bad: 'ملف غير صالح', hook_added: 'أُضيفت إلى الأفكار', day_empty: 'لا شيء مجدول هذا اليوم.',
      sched_existing: 'جدولة فكرة موجودة…', quick_add: 'عنوان فكرة جديدة لهذا اليوم', add: 'إضافة', unschedule: 'إلغاء الجدولة', no_ics: 'لا توجد أفكار مجدولة للتصدير', wiped: 'تم المسح', storage_err: 'تعذّر الحفظ: المتصفح ممتلئ أو يمنع التخزين'
    },
    en: {
      brand: 'Fikra', tagline: 'Short-video idea bank', tab_ideas: 'Ideas', tab_hooks: 'Hooks', tab_cal: 'Calendar',
      add_idea: '+ New idea', search: 'Search ideas…', all_status: 'All statuses', all_tags: 'All tags',
      st_idea: 'Idea', st_script: 'Scripted', st_filmed: 'Filmed', st_posted: 'Posted',
      pf_shorts: 'Shorts', pf_reels: 'Reels', pf_tiktok: 'TikTok',
      s_total: 'Total', s_scheduled: 'Scheduled', s_posted: 'Posted', s_pct: 'Done', s_streak: 'Day streak',
      exp_json: 'Export JSON', exp_csv: 'Export CSV', imp_json: 'Import JSON', wipe: 'Erase everything', exp_ics: 'Export calendar (ICS)',
      empty_t: 'No ideas yet. Start one or try the sample data.', sample: 'Load samples', none_match: 'Nothing matches.',
      topic_label: 'Your topic', topic_ph: 'e.g. video editing, coffee, AI tools', shuffle: 'Shuffle hooks',
      cat_all: 'All', cat_curiosity: 'Curiosity', cat_mistake: 'Mistakes', cat_how: 'How-to', cat_story: 'Story', cat_list: 'Lists', cat_contrast: 'Contrast', cat_challenge: 'Challenge', cat_question: 'Question',
      use_hook: 'Make it an idea', copy: 'Copy', copied: 'Copied', today: 'Today', cal_hint: 'Tap a day to schedule an idea or add a new one.',
      foot: 'Works offline. Your data stays in this browser only.',
      f_title: 'Title', f_hook: 'Hook (first 3 seconds)', f_tag: 'Tag', f_date: 'Post date', f_platform: 'Platform', f_status: 'Status', f_notes: 'Notes', f_star: 'Favorite',
      cancel: 'Cancel', save: 'Save', close: 'Close', new_t: 'New idea', edit_t: 'Edit idea', edit: 'Edit', del: 'Delete', next: 'Next →',
      confirm_del: 'Delete this idea?', confirm_wipe: 'This erases every idea in this browser. Sure?', saved: 'Saved', deleted: 'Deleted',
      imported: '{n} ideas added', imp_bad: 'Invalid file', hook_added: 'Added to ideas', day_empty: 'Nothing scheduled this day.',
      sched_existing: 'Schedule an existing idea…', quick_add: 'Title of a new idea for this day', add: 'Add', unschedule: 'Unschedule', no_ics: 'No scheduled ideas to export', wiped: 'Erased', storage_err: 'Could not save: browser storage is full or blocked'
    }
  };
  var DOWS = { ar: ['سبت', 'أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };

  var S = { lang: 'ar', theme: 'dark', ideas: [], view: 'ideas', cat: 'all', seed: 0, topic: '', fStar: false, month: null, year: null };
  var toastTimer;

  function t(k) { return T[S.lang][k] || k; }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var d = JSON.parse(raw); S.lang = d.lang === 'en' ? 'en' : 'ar'; S.theme = d.theme === 'light' ? 'light' : 'dark'; S.ideas = (d.ideas || []).map(L.sanitizeIdea).filter(L.validIdea); return; }
    } catch (e) {}
    S.lang = (navigator.language || '').slice(0, 2) === 'en' ? 'en' : 'ar';
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ lang: S.lang, theme: S.theme, ideas: S.ideas })); return true; }
    catch (e) { toast(t('storage_err')); return false; }
  }
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }
  function el(tag, cls, text, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function today() { var d = new Date(); return L.ymd(d.getFullYear(), d.getMonth(), d.getDate()); }
  function fmtDate(s) {
    var p = L.parseYmd(s); if (!p) return '';
    return new Intl.DateTimeFormat(S.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(p.y, p.m, p.d)));
  }

  function applyStatic() {
    document.documentElement.lang = S.lang;
    document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = S.theme;
    document.title = S.lang === 'ar' ? 'فكرة · Fikra' : 'Fikra · idea bank';
    document.querySelectorAll('[data-i]').forEach(function (n) { n.textContent = t(n.dataset.i); });
    document.querySelectorAll('[data-ph]').forEach(function (n) { n.placeholder = t(n.dataset.ph); });
    $('#langBtn').textContent = S.lang === 'ar' ? 'EN' : 'ع';
    var sel = function (id, items, first) {
      var s = $(id), cur = s.value; s.textContent = '';
      if (first) s.appendChild(new Option(first[1], first[0]));
      items.forEach(function (i) { s.appendChild(new Option(i[1], i[0])); });
      if ([].some.call(s.options, function (o) { return o.value === cur; })) s.value = cur;
    };
    sel('#fStatus', L.STATUSES.map(function (s) { return [s, t('st_' + s)]; }), ['all', t('all_status')]);
    var ef = $('#editForm');
    var fill = function (name, items) { var s = ef.elements[name], cur = s.value; s.textContent = ''; items.forEach(function (i) { s.appendChild(new Option(i[1], i[0])); }); if (cur) s.value = cur; };
    fill('platform', L.PLATFORMS.map(function (p) { return [p, t('pf_' + p)]; }));
    fill('status', L.STATUSES.map(function (s) { return [s, t('st_' + s)]; }));
    var dow = $('#dow'); dow.textContent = '';
    DOWS[S.lang].forEach(function (d) { dow.appendChild(el('div', '', d)); });
    var cats = $('#cats'); cats.textContent = '';
    ['all'].concat(L.CATS).forEach(function (c) {
      var b = el('button', 'chip', t('cat_' + c), { 'aria-pressed': String(S.cat === c), 'data-cat': c });
      b.addEventListener('click', function () { S.cat = c; renderHooks(); [].forEach.call(cats.children, function (x) { x.setAttribute('aria-pressed', String(x.dataset.cat === S.cat)); }); });
      cats.appendChild(b);
    });
  }

  function renderTags() {
    var s = $('#fTag'), cur = s.value; s.textContent = '';
    s.appendChild(new Option(t('all_tags'), 'all'));
    L.tagsOf(S.ideas).forEach(function (g) { s.appendChild(new Option(g, g)); });
    if ([].some.call(s.options, function (o) { return o.value === cur; })) s.value = cur;
    var dl = $('#tagList'); dl.textContent = '';
    L.tagsOf(S.ideas).forEach(function (g) { dl.appendChild(new Option(g)); });
  }
  function renderStats() {
    var st = L.stats(S.ideas), box = $('#stats'); box.textContent = '';
    [['s_total', st.total], ['s_scheduled', st.scheduled], ['s_posted', st.posted], ['s_pct', st.pct + '%'], ['s_streak', L.streak(S.ideas, today())]].forEach(function (x) {
      var d = el('div', 'stat'); d.appendChild(el('b', '', String(x[1]))); d.appendChild(el('span', '', t(x[0]))); box.appendChild(d);
    });
  }
  function renderIdeas() {
    renderTags(); renderStats();
    var list = L.filterIdeas(S.ideas, { q: $('#q').value, status: $('#fStatus').value, tag: $('#fTag').value, star: S.fStar, sort: 'created' });
    var box = $('#list'); box.textContent = '';
    if (!list.length) {
      var e = el('div', 'empty', S.ideas.length ? t('none_match') : t('empty_t'));
      if (!S.ideas.length) {
        e.appendChild(el('br'));
        var b1 = el('button', 'btn primary', t('add_idea'), { id: 'emptyAdd' }); b1.addEventListener('click', function () { openEditor(); });
        var b2 = el('button', 'btn ghost', t('sample'), { id: 'sampleBtn' }); b2.addEventListener('click', loadSample);
        e.appendChild(b1); e.appendChild(b2);
      }
      box.appendChild(e); return;
    }
    list.forEach(function (i) {
      var c = el('article', 'card'); c.dataset.status = i.status; c.dataset.id = i.id;
      var star = el('button', 'star', '★', { 'aria-pressed': String(i.star), 'aria-label': t('f_star') });
      star.addEventListener('click', function () { i.star = !i.star; save(); renderIdeas(); });
      c.appendChild(star);
      c.appendChild(el('h3', '', i.title));
      if (i.hook) c.appendChild(el('p', 'hook', i.hook));
      var m = el('div', 'meta');
      m.appendChild(el('span', 'pill', t('st_' + i.status)));
      m.appendChild(el('span', 'pill', t('pf_' + i.platform)));
      if (i.tag) m.appendChild(el('span', 'pill', '#' + i.tag));
      if (i.date) m.appendChild(el('span', 'pill', fmtDate(i.date)));
      c.appendChild(m);
      var a = el('div', 'acts');
      if (i.status !== 'posted') { var n = el('button', 'next', t('next')); n.addEventListener('click', function () { i.status = L.nextStatus(i.status); save(); renderAll(); }); a.appendChild(n); }
      var ed = el('button', 'edit', t('edit')); ed.addEventListener('click', function () { openEditor(i); }); a.appendChild(ed);
      var dl = el('button', 'del', t('del')); dl.addEventListener('click', function () { if (confirm(t('confirm_del'))) { S.ideas = S.ideas.filter(function (x) { return x.id !== i.id; }); save(); renderAll(); toast(t('deleted')); } }); a.appendChild(dl);
      c.appendChild(a); box.appendChild(c);
    });
  }

  function renderHooks() {
    var box = $('#hookList'); box.textContent = '';
    var topic = $('#topic').value;
    var tpls = L.TEMPLATES.filter(function (x) { return S.cat === 'all' || x.cat === S.cat; });
    if (S.seed) tpls = tpls.slice().sort(function (a, b) { return hash(a.id + S.seed) - hash(b.id + S.seed); });
    tpls.forEach(function (tp) {
      var text = L.fillTemplate(tp, topic, S.lang);
      var c = el('div', 'hook-card');
      c.appendChild(el('q', '', text));
      c.appendChild(el('small', '', '# ' + t('cat_' + tp.cat)));
      var a = el('div', 'acts');
      var use = el('button', 'use', t('use_hook'));
      use.addEventListener('click', function () { var idea = L.sanitizeIdea({ title: topic.trim() || text, hook: text, tag: t('cat_' + tp.cat) }); S.ideas.push(idea); if (save()) { toast(t('hook_added')); } renderIdeas(); });
      var cp = el('button', 'copy', t('copy'));
      cp.addEventListener('click', function () {
        var done = function () { toast(t('copied')); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
      });
      a.appendChild(use); a.appendChild(cp); c.appendChild(a); box.appendChild(c);
    });
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

  function renderCal() {
    $('#monthTitle').textContent = new Intl.DateTimeFormat(S.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(S.year, S.month, 1)));
    var grid = $('#grid'); grid.textContent = '';
    var by = {}; S.ideas.forEach(function (i) { if (i.date) (by[i.date] = by[i.date] || []).push(i); });
    var td = today();
    L.monthGrid(S.year, S.month, S.lang === 'ar' ? 6 : 1).forEach(function (ds) {
      if (!ds) { grid.appendChild(el('div', 'day blank')); return; }
      var b = el('button', 'day' + (ds === td ? ' today' : ''), null, { 'data-date': ds, type: 'button' });
      b.appendChild(el('span', 'n', String(+ds.slice(8))));
      b.setAttribute('aria-label', fmtDate(ds) + (by[ds] ? ' (' + by[ds].length + ')' : ''));
      var items = by[ds] || [];
      items.slice(0, 2).forEach(function (i) { var d = el('span', 'dot', i.title); d.dataset.status = i.status; b.appendChild(d); });
      if (items.length > 2) b.appendChild(el('span', 'more', '+' + (items.length - 2)));
      b.addEventListener('click', function () { openDay(ds); });
      grid.appendChild(b);
    });
  }

  function openDay(ds) {
    var body = $('#dayBody'); body.textContent = '';
    body.appendChild(el('h3', '', fmtDate(ds)));
    var ul = el('ul', 'dlist');
    var items = S.ideas.filter(function (i) { return i.date === ds; });
    if (!items.length) ul.appendChild(el('li', '', t('day_empty')));
    items.forEach(function (i) {
      var li = el('li'); li.appendChild(el('span', '', i.title));
      var x = el('button', 'unsched', '✕', { 'aria-label': t('unschedule'), title: t('unschedule') });
      x.addEventListener('click', function () { i.date = ''; save(); renderAll(); openDay(ds); });
      li.appendChild(x); ul.appendChild(li);
    });
    body.appendChild(ul);
    var free = S.ideas.filter(function (i) { return !i.date; });
    if (free.length) {
      var sel = el('select', '', null, { id: 'daySel', 'aria-label': t('sched_existing') });
      sel.appendChild(new Option(t('sched_existing'), ''));
      free.forEach(function (i) { sel.appendChild(new Option(i.title, i.id)); });
      sel.addEventListener('change', function () { var i = S.ideas.filter(function (x) { return x.id === sel.value; })[0]; if (i) { i.date = ds; save(); renderAll(); openDay(ds); } });
      body.appendChild(sel);
    }
    var row = el('div', 'row'); row.style.marginTop = '10px';
    var inp = el('input', '', null, { id: 'dayNew', maxlength: '120', placeholder: t('quick_add') });
    var add = el('button', 'btn primary', t('add'), { id: 'dayAdd', type: 'button' });
    var go = function () { if (!inp.value.trim()) return; S.ideas.push(L.sanitizeIdea({ title: inp.value, date: ds })); save(); renderAll(); openDay(ds); };
    add.addEventListener('click', go); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    row.appendChild(inp); row.appendChild(add); body.appendChild(row);
    var dlg = $('#dayDlg'); if (!dlg.open) dlg.showModal();
  }

  var editingId = null;
  function openEditor(i) {
    var f = $('#editForm'); editingId = i ? i.id : null;
    $('#edTitle').textContent = t(i ? 'edit_t' : 'new_t');
    ['title', 'hook', 'tag', 'date', 'notes'].forEach(function (k) { f.elements[k].value = i ? i[k] : ''; });
    f.elements.platform.value = i ? i.platform : 'shorts';
    f.elements.status.value = i ? i.status : 'idea';
    f.elements.star.checked = i ? i.star : false;
    $('#editor').showModal(); f.elements.title.focus();
  }
  function submitEditor() {
    var f = $('#editForm');
    var data = { title: f.elements.title.value, hook: f.elements.hook.value, tag: f.elements.tag.value, date: f.elements.date.value, notes: f.elements.notes.value,
      platform: f.elements.platform.value, status: f.elements.status.value, star: f.elements.star.checked };
    if (editingId) {
      var cur = S.ideas.filter(function (x) { return x.id === editingId; })[0];
      if (cur) { data.id = cur.id; data.created = cur.created; var n = L.sanitizeIdea(data); if (!L.validIdea(n)) return; S.ideas[S.ideas.indexOf(cur)] = n; }
    } else { var ni = L.sanitizeIdea(data); if (!L.validIdea(ni)) return; S.ideas.push(ni); }
    save(); renderAll(); toast(t('saved'));
  }

  function loadSample() {
    var now = new Date(), y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
    var at = function (off) { var x = new Date(y, m, d + off); return L.ymd(x.getFullYear(), x.getMonth(), x.getDate()); };
    var base = Date.now();
    var rows = S.lang === 'ar' ? [
      ['٣ أخطاء تدمّر مونتاجك', 'توقف عن قص المشاهد بهذه الطريقة', 'مونتاج', 'posted', -2, 1],
      ['جرّبت القهوة المثلجة لأسبوع', 'لن تصدق ما حدث لنومي', 'حياة', 'filmed', 0, 1],
      ['٥ أدوات مجانية للتصميم', 'كلها بدون حساب ولا اشتراك', 'أدوات', 'script', 2, 0],
      ['كيف تبدأ قناة من الصفر', 'قبل سنة لم أكن أعرف شيئاً', 'نصائح', 'idea', 4, 1],
      ['هل تعلم هذا عن هاتفك؟', 'ميزة مخفية في الإعدادات', 'أدوات', 'idea', 0, 0],
      ['تحدّي: فيديو بدون ميزانية', 'هل يمكن؟ دعنا نرى', 'نصائح', 'idea', 0, 0]
    ] : [
      ['3 mistakes that ruin your edit', 'Stop cutting your scenes this way', 'editing', 'posted', -2, 1],
      ['I tried iced coffee for a week', "You won't believe what happened to my sleep", 'life', 'filmed', 0, 1],
      ['5 free design tools', 'No account, no subscription', 'tools', 'script', 2, 0],
      ['How to start a channel from zero', 'A year ago I knew nothing', 'tips', 'idea', 4, 1],
      ['Did you know this about your phone?', 'A hidden setting most people miss', 'tools', 'idea', 0, 0],
      ['Challenge: a video with zero budget', 'Can it be done? Let us see', 'tips', 'idea', 0, 0]
    ];
    rows.forEach(function (r, k) {
      var withDate = k < 4;
      S.ideas.push(L.sanitizeIdea({ title: r[0], hook: r[1], tag: r[2], status: r[3], date: withDate ? at(r[4]) : '', star: !!r[5], platform: ['shorts', 'reels', 'tiktok'][k % 3], created: base + k }));
    });
    save(); renderAll();
  }

  function download(name, mime, text) {
    var a = el('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function setView(v) {
    S.view = v;
    ['ideas', 'hooks', 'cal'].forEach(function (x) { $('#view-' + x).hidden = x !== v; $('#tab-' + x).setAttribute('aria-selected', String(x === v)); });
    if (v === 'hooks') renderHooks(); if (v === 'cal') renderCal(); if (v === 'ideas') renderIdeas();
    try { history.replaceState(null, '', '#' + v); } catch (e) {}
  }
  function renderAll() { renderIdeas(); if (S.view === 'cal') renderCal(); }

  function init() {
    load();
    var n = new Date(); S.month = n.getMonth(); S.year = n.getFullYear();
    applyStatic(); renderTags();
    $('#langBtn').addEventListener('click', function () { S.lang = S.lang === 'ar' ? 'en' : 'ar'; save(); applyStatic(); setView(S.view); });
    $('#themeBtn').addEventListener('click', function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; save(); applyStatic(); });
    document.querySelectorAll('.tabs button').forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.view); }); });
    $('#addBtn').addEventListener('click', function () { openEditor(); });
    ['#q', '#fStatus', '#fTag'].forEach(function (s) { $(s).addEventListener('input', renderIdeas); });
    $('#fStar').addEventListener('click', function () { S.fStar = !S.fStar; $('#fStar').setAttribute('aria-pressed', String(S.fStar)); renderIdeas(); });
    $('#editForm').addEventListener('submit', submitEditor);
    $('#edCancel').addEventListener('click', function () { $('#editor').close(); });
    $('#dayClose').addEventListener('click', function () { $('#dayDlg').close(); });
    $('#topic').addEventListener('input', renderHooks);
    $('#shuffle').addEventListener('click', function () { S.seed = Math.floor(Math.random() * 1e6) + 1; renderHooks(); });
    $('#prevM').addEventListener('click', function () { S.month--; if (S.month < 0) { S.month = 11; S.year--; } renderCal(); });
    $('#nextM').addEventListener('click', function () { S.month++; if (S.month > 11) { S.month = 0; S.year++; } renderCal(); });
    $('#todayBtn').addEventListener('click', function () { var d = new Date(); S.month = d.getMonth(); S.year = d.getFullYear(); renderCal(); });
    $('#icsBtn').addEventListener('click', function () { if (!S.ideas.some(function (i) { return i.date; })) { toast(t('no_ics')); return; } download('fikra-calendar.ics', 'text/calendar', L.toICS(S.ideas)); });
    $('#expJson').addEventListener('click', function () { download('fikra-ideas.json', 'application/json', JSON.stringify({ app: 'fikra', ideas: S.ideas }, null, 2)); });
    $('#expCsv').addEventListener('click', function () { download('fikra-ideas.csv', 'text/csv', '\ufeff' + L.toCSV(S.ideas)); });
    $('#impBtn').addEventListener('click', function () { $('#impFile').click(); });
    $('#impFile').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var res = L.importJSON(String(r.result));
        if (!res.ok) { toast(t('imp_bad')); return; }
        var m = L.mergeIdeas(S.ideas, res.ideas); S.ideas = m.list; save(); renderAll(); toast(t('imported').replace('{n}', m.added));
      };
      r.readAsText(f); e.target.value = '';
    });
    $('#wipeBtn').addEventListener('click', function () { if (confirm(t('confirm_wipe'))) { S.ideas = []; save(); renderAll(); toast(t('wiped')); } });
    var h = location.hash.slice(1);
    setView(['ideas', 'hooks', 'cal'].indexOf(h) >= 0 ? h : 'ideas');
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(function () {});
    window.__fikra = S;
  }
  init();
})();
