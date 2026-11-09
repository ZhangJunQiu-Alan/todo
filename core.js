// 状态和交互：勾选、决策、倒计时、导出。
// 内容来自 data.js；网页上的勾选和决策先存在浏览器 localStorage，按 id 覆盖 data.js 里的 done / resolved。
(function () {
  const D = window.TODO;
  const KEY = 'zxhy-todo-state-v1';
  const SGT = 8 * 3600e3;
  const WD = ['日', '一', '二', '三', '四', '五', '六'];

  let state = load();
  const subs = [];

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.done && s.dec) return s;
    } catch (e) {}
    return { done: {}, dec: {} };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function emit(type, id) {
    sync();
    subs.forEach((f) => f(type, id));
  }

  const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
  const task = byId(D.tasks);
  const decision = byId(D.decisions);
  const group = byId(D.groups);

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function fmt(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  // f 路径开头的 {名字} 用本机 local.js 里的 TODO_LOCAL 替换
  const localPath = (f) => f.replace(/^\{(\w+)\}/, (m, k) => (window.TODO_LOCAL || {})[k] || m);
  function href(l) {
    if (l.u) return l.u;
    if (l.f) return 'file://' + encodeURI(localPath(l.f));
    return l.a || '#';
  }
  function link(l, cls = '') {
    // 网上打不开本地文件；本机缺 local.js 时带占位符的路径也打不开，这两种都不显示
    if (l.f && (location.protocol !== 'file:' || localPath(l.f).startsWith('{'))) return '';
    const kind = l.u ? 'web' : l.f ? 'file' : 'anchor';
    const tgt = kind === 'anchor' ? ` data-goto="${esc(l.a.slice(1))}"` : ' target="_blank" rel="noopener"';
    const title = kind === 'file' ? ` title="${esc(localPath(l.f))}"` : '';
    return `<a class="${cls}" data-kind="${kind}" href="${esc(href(l))}"${tgt}${title}>${esc(l.t)}</a>`;
  }

  // 新加坡没有夏令时，固定 +8
  function sg(dateLike) {
    const d = new Date(new Date(dateLike).getTime() + SGT);
    return {
      y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), wd: WD[d.getUTCDay()],
      hm: String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'),
      day: Math.floor(d.getTime() / 86400e3),
    };
  }
  const daysLeft = (iso) => sg(iso).day - sg(Date.now()).day;
  function remain(iso) {
    const ms = new Date(iso).getTime() - Date.now();
    const a = Math.abs(ms);
    return { past: ms < 0, ms, d: Math.floor(a / 86400e3), h: Math.floor(a / 3600e3) % 24, m: Math.floor(a / 60e3) % 60, s: Math.floor(a / 1e3) % 60 };
  }
  const pad = (n) => String(n).padStart(2, '0');

  // 网页上动过的以网页为准（0 = 取消勾选），没动过的看 data.js 的 done
  const isDone = (id) => (id in state.done ? !!state.done[id] : !!(task[id] && task[id].done));
  function toggle(id, val) {
    state.done[id] = (val ?? !isDone(id)) ? Date.now() : 0;
    save();
    emit('task', id);
  }
  const dec = (id) => ({ ...((decision[id] && decision[id].resolved) || {}), ...(state.dec[id] || {}) });
  function setChoice(id, v) {
    const cur = dec(id);
    state.dec[id] = { ...cur, choice: cur.choice === v ? '' : v, at: Date.now() };
    save();
    emit('dec', id);
  }
  let noteTimer;
  function setNote(id, text) {
    state.dec[id] = { ...dec(id), note: text, at: Date.now() };
    clearTimeout(noteTimer);
    noteTimer = setTimeout(save, 250);
    emit('note', id);
  }
  function decided(id) {
    const x = dec(id);
    return !!(x.choice || (x.note && x.note.trim()));
  }
  function taskDecState(t) {
    if (!t.dec || !t.dec.length) return 'none';
    return t.dec.every(decided) ? 'done' : 'open';
  }
  const overdue = (t) => t.due && !isDone(t.id) && Date.now() > new Date(t.due).getTime();

  const tasksOf = (g, s) => D.tasks.filter((t) => t.g === g && (!s || t.s === s));
  const decisionsOf = (g) => D.decisions.filter((d) => !g || d.g === g);
  function progress(g) {
    const list = D.tasks.filter((t) => !t.idea && (!g || t.g === g));
    return { done: list.filter((t) => isDone(t.id)).length, total: list.length };
  }
  const ratio = (x) => (x.total ? x.done / x.total : 0);
  function decStats(g) {
    const list = decisionsOf(g);
    return { done: list.filter((d) => decided(d.id)).length, total: list.length };
  }
  // 按截止时间聚合（时间轴用）
  function milestones() {
    const map = new Map();
    D.tasks.filter((t) => t.due).forEach((t) => {
      if (!map.has(t.due)) map.set(t.due, []);
      map.get(t.due).push(t);
    });
    return [...map.entries()].sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([iso, tasks]) => ({ iso, tasks }));
  }
  function nextDeadline() {
    const now = Date.now();
    return milestones().find((m) => new Date(m.iso).getTime() > now && m.tasks.some((t) => !isDone(t.id))) || null;
  }

  // 括号里是 id，Codex 按 AGENTS.md 用它写回 data.js
  function exportMarkdown() {
    const now = sg(Date.now());
    const date = `${now.y}-${pad(now.m)}-${pad(now.d)}`;
    const out = ['# Todo 决策记录', '', `导出时间：${date} ${now.hm}（新加坡时间）。按 Todo网页/AGENTS.md 写回 data.js。`, ''];
    D.groups.forEach((g) => {
      const list = decisionsOf(g.id);
      if (!list.length) return;
      out.push(`## ${g.name}`, '');
      list.forEach((d) => {
        const x = dec(d.id);
        const has = x.note && x.note.trim();
        out.push(`- **${d.title}**（${d.id}）：${x.choice || (has ? '见补充' : '（未定）')}`);
        if (has) out.push('  - 补充：' + x.note.trim().replace(/\n/g, '\n    '));
      });
      out.push('');
    });
    const newlyDone = D.tasks.filter((t) => isDone(t.id) && !t.done);
    const undone = D.tasks.filter((t) => !isDone(t.id) && t.done);
    if (newlyDone.length) {
      out.push('## 网页上勾选完成，data.js 还没记', '');
      newlyDone.forEach((t) => out.push(`- [x] ${t.title}（${t.id}）`));
      out.push('');
    }
    if (undone.length) {
      out.push('## 网页上取消了完成', '');
      undone.forEach((t) => out.push(`- [ ] ${t.title}（${t.id}）`));
      out.push('');
    }
    return out.join('\n');
  }
  // 网页上改过、但和 data.js 不一样的决策与勾选：这些才需要提交
  function pendingSync() {
    const decs = D.decisions.filter((d) => {
      const loc = state.dec[d.id];
      if (!loc) return false;
      const r = d.resolved || {};
      const x = dec(d.id);
      return (x.choice || '') !== (r.choice || '') || (x.note || '').trim() !== (r.note || '').trim();
    });
    const done = D.tasks.filter((t) => t.id in state.done && !!state.done[t.id] && !t.done);
    const undone = D.tasks.filter((t) => t.id in state.done && !state.done[t.id] && t.done);
    return { decs, done, undone, count: decs.length + done.length + undone.length };
  }

  function issueBody(p) {
    const out = ['<!-- todo-sync v1 -->', '网页「提交到 GitHub」生成。按 AGENTS.md「同步网页提交的决策」写回 data.js。', ''];
    if (p.decs.length) {
      out.push('## 决策', '');
      p.decs.forEach((d) => {
        const x = dec(d.id);
        const note = (x.note || '').trim();
        out.push(`- \`${d.id}\` ${d.title}：${x.choice ? `**${x.choice}**` : note ? '见补充' : '（撤销）'}`);
        if (note) out.push('  补充：' + note.replace(/\n/g, '\n  '));
      });
      out.push('');
    }
    if (p.done.length) out.push('## 勾选完成', '', ...p.done.map((t) => `- [x] \`${t.id}\` ${t.title}`), '');
    if (p.undone.length) out.push('## 取消完成', '', ...p.undone.map((t) => `- [ ] \`${t.id}\` ${t.title}`), '');
    return out.join('\n');
  }

  // 打开预填好的 GitHub Issue；链接太长时把正文放进剪贴板，让用户粘贴
  function submitGitHub() {
    const p = pendingSync();
    if (!D.repo) return toast('data.js 里没有设置 repo');
    if (!p.count) return toast('没有新的决策或勾选要提交');
    const now = sg(Date.now());
    const title = `决策同步 · ${now.y}-${pad(now.m)}-${pad(now.d)} ${now.hm} · ${p.count} 项`;
    const body = issueBody(p);
    const base = `https://github.com/${D.repo}/issues/new?`;
    let url = base + new URLSearchParams({ title, body, labels: '决策同步' });
    if (url.length > 7000) {
      copy(body);
      url = base + new URLSearchParams({ title, body: '（内容较长，已复制到剪贴板：在这里粘贴后提交）', labels: '决策同步' });
      window.open(url, '_blank', 'noopener');
      return toast('内容较长，已复制，到 GitHub 页面粘贴后提交');
    }
    window.open(url, '_blank', 'noopener');
    toast(`已打开 GitHub，确认后点 Create 提交（${p.count} 项）`);
  }
  const toast = (msg) => subs.forEach((f) => f('toast', msg));

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }

  function grow(t) {
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 2 + 'px';
  }
  function flash(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  function sync(root = document) {
    root.querySelectorAll('input[data-task]').forEach((cb) => { cb.checked = isDone(cb.dataset.task); });
    root.querySelectorAll('[data-task-row]').forEach((el) => {
      const t = task[el.dataset.taskRow];
      el.classList.toggle('is-done', isDone(t.id));
      el.classList.toggle('is-overdue', !!overdue(t));
      el.dataset.dec = taskDecState(t);
    });
    root.querySelectorAll('[data-choice]').forEach((b) => {
      const on = dec(b.dataset.dec).choice === b.dataset.choice;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });
    root.querySelectorAll('textarea[data-note]').forEach((t) => {
      if (document.activeElement !== t) { t.value = dec(t.dataset.note).note || ''; grow(t); }
    });
    root.querySelectorAll('[data-dec-card]').forEach((el) => el.classList.toggle('is-decided', decided(el.dataset.decCard)));
  }

  function wire() {
    document.addEventListener('change', (e) => {
      const cb = e.target.closest('input[data-task]');
      if (cb) toggle(cb.dataset.task, cb.checked);
    });
    document.addEventListener('click', (e) => {
      const c = e.target.closest('[data-choice]');
      if (c) return setChoice(c.dataset.dec, c.dataset.choice);
      const cp = e.target.closest('[data-copy-md]');
      if (cp) return copy(exportMarkdown()).then(() => subs.forEach((f) => f('copied')));
      if (e.target.closest('[data-submit-gh]')) return submitGitHub();
      const go = e.target.closest('[data-goto]');
      if (go) { e.preventDefault(); flash(go.dataset.goto); }
    });
    document.addEventListener('input', (e) => {
      const n = e.target.closest('textarea[data-note]');
      if (n) { grow(n); setNote(n.dataset.note, n.value); }
    });
    window.addEventListener('storage', (e) => {
      if (e.key === KEY) { state = load(); emit('external'); }
    });
  }

  function start(render, onChange) {
    render();
    wire();
    sync();
    if (onChange) subs.push(onChange);
    if (onChange) onChange('init');
  }

  window.TC = {
    D, task, decision, group, esc, fmt, link, href, sg, pad, daysLeft, remain,
    isDone, toggle, dec, decided, taskDecState, overdue, tasksOf, decisionsOf,
    progress, ratio, decStats, milestones, nextDeadline, exportMarkdown, pendingSync, issueBody, copy, flash, sync, start,
  };
})();
