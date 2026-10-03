/* Broderick Learning Hub: shared light/dark/auto theme switch.
   Remembers the choice in localStorage under "hub-theme" (same key the guide pages already use). */
(function () {
  var KEY = 'hub-theme', root = document.documentElement, orig = [], hasDark = null, mq = null;
  try { mq = matchMedia('(prefers-color-scheme: dark)'); } catch (e) {}
  function mode() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'auto'; } catch (e) { return 'auto'; } }
  function save(v) { try { if (v === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, v); } catch (e) {} }
  function osDark() { return !!(mq && mq.matches); }

  function walk(rules, out) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (r.media && r.media.mediaText && /prefers-color-scheme/.test(r.media.mediaText)) {
        out.push({ rule: r, text: r.media.mediaText, dark: /prefers-color-scheme:\s*dark/.test(r.media.mediaText) });
      }
      if (r.cssRules && r.cssRules.length) walk(r.cssRules, out);
    }
  }
  function scan() {
    orig = [];
    for (var i = 0; i < document.styleSheets.length; i++) {
      var s = document.styleSheets[i], rs;
      if (s.ownerNode && s.ownerNode.id === 'blh-style') continue;
      try { rs = s.cssRules; } catch (e) { continue; }
      if (rs) walk(rs, orig);
    }
    hasDark = orig.some(function (o) { return o.dark; });
  }
  function apply() {
    var m = mode();
    if (m === 'auto') delete root.dataset.theme; else root.dataset.theme = m;
    root.style.colorScheme = m === 'auto' ? '' : m;
    if (hasDark === null) return;
    orig.forEach(function (o) {
      var t = o.text;
      if (m === 'dark') t = o.dark ? 'all' : 'not all';
      else if (m === 'light') t = o.dark ? 'not all' : 'all';
      try { o.rule.media.mediaText = t; } catch (e) {}
    });
    var wantDark = m === 'dark' || (m === 'auto' && osDark());
    root.classList.toggle('blh-inv', !hasDark && wantDark);
    label();
  }
  var btn;
  function label() {
    if (!btn) return;
    var m = mode();
    btn.textContent = (m === 'auto' ? '◐ Auto' : m === 'light' ? '☀ Light' : '☾ Dark');
    btn.setAttribute('aria-label', 'Color theme: ' + m + '. Click to change.');
  }
  function build() {
    if (document.getElementById('th') || document.getElementById('theme') || document.getElementById('blh-theme')) return;
    var st = document.createElement('style'); st.id = 'blh-style';
    st.textContent = '#blh-theme{position:fixed;left:12px;bottom:12px;z-index:2147483000;font:600 12.5px/1 system-ui,-apple-system,Segoe UI,sans-serif;padding:8px 12px;border-radius:999px;border:1px solid rgba(120,130,145,.55);background:#fff;color:#16202a;box-shadow:0 2px 10px rgba(0,0,0,.18);cursor:pointer}' +
      '#blh-theme:focus-visible{outline:2px solid #2a7f9e;outline-offset:2px}' +
      'html[data-theme=dark] #blh-theme{background:#1b2733;color:#e8eef4}' +
      '@media(prefers-color-scheme:dark){html:not([data-theme]) #blh-theme{background:#1b2733;color:#e8eef4}}' +
      'html.blh-inv{background:#fff}html.blh-inv img,html.blh-inv video,html.blh-inv canvas,html.blh-inv picture,html.blh-inv iframe,html.blh-inv #blh-theme{filter:invert(1) hue-rotate(180deg)}' +
      'html.blh-inv{filter:invert(1) hue-rotate(180deg)}' +
      '@media print{#blh-theme{display:none}html.blh-inv,html.blh-inv img{filter:none}}';
    document.head.appendChild(st);
    btn = document.createElement('button');
    btn.id = 'blh-theme'; btn.type = 'button';
    btn.addEventListener('click', function () {
      var n = { auto: 'light', light: 'dark', dark: 'auto' }[mode()];
      save(n); apply();
    });
    document.body.appendChild(btn);
    label();
  }
  function init() { scan(); build(); apply(); }
  apply();
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', function () { scan(); apply(); });
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (mode() === 'auto') apply(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(); });
})();
