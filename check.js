// 校验 data.js。用法（在本目录）：node check.js
// 有错误时退出码为 1；警告不影响通过。
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const errors = [];
const warns = [];
const err = (where, msg) => errors.push(`${where}：${msg}`);
const warn = (where, msg) => warns.push(`${where}：${msg}`);

const ctx = { window: {} };
const src = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
const localFile = path.join(__dirname, 'local.js');
try {
  if (fs.existsSync(localFile)) vm.runInNewContext(fs.readFileSync(localFile, 'utf8'), ctx, { filename: 'local.js' });
  vm.runInNewContext(src, ctx, { filename: 'data.js' });
} catch (e) {
  console.error('无法执行：' + e.message);
  process.exit(1);
}
const LOCAL = ctx.window.TODO_LOCAL || {};
// data.js 会随网页公开发布
const email = src.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
if (email) errors.push(`data.js：出现了邮箱「${email[0]}」。data.js 会公开发布；本地路径里的私人部分放进 local.js，用 {名字} 占位`);
const D = ctx.window.TODO;
if (!D || !Array.isArray(D.groups) || !Array.isArray(D.tasks) || !Array.isArray(D.decisions)) {
  console.error('data.js 必须设置 window.TODO = { groups: [], tasks: [], decisions: [] }');
  process.exit(1);
}

const COLORS = ['red', 'blue', 'yellow', 'ink'];
const ID = /^[a-z0-9][a-z0-9-]*$/;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const KEYS = {
  group: ['id', 'name', 'short', 'en', 'color', 'note', 'links', 'sections', 'dueNote', 'window'],
  task: ['id', 'g', 's', 'title', 'desc', 'meta', 'due', 'dueText', 'short', 'code', 'links', 'dec', 'flag', 'hot', 'tag', 'owner', 'idea', 'done'],
  decision: ['id', 'g', 'kind', 'title', 'q', 'due', 'opts', 'rec', 'links', 'resolved'],
};

const seen = new Map();
function checkId(where, id) {
  if (typeof id !== 'string' || !ID.test(id)) return err(where, `id「${id}」只能用小写字母、数字和连字符`);
  if (seen.has(id)) err(where, `id「${id}」和 ${seen.get(id)} 重复`);
  seen.set(id, where);
}
function checkKeys(where, obj, kind) {
  Object.keys(obj).forEach((k) => { if (!KEYS[kind].includes(k)) warn(where, `不认识的字段「${k}」，网页不会显示它`); });
}
function checkDue(where, v, field = 'due') {
  if (v == null) return;
  if (typeof v !== 'string' || !ISO.test(v) || isNaN(new Date(v))) err(where, `${field}「${v}」要写成 YYYY-MM-DDTHH:MM:00+08:00`);
}
function checkLinks(where, links) {
  if (links == null) return;
  if (!Array.isArray(links)) return err(where, 'links 必须是数组');
  links.forEach((l, i) => {
    const w = `${where} links[${i}]`;
    if (!l || typeof l.t !== 'string' || !l.t) return err(w, '缺少链接文字 t');
    const kinds = ['u', 'f', 'a'].filter((k) => l[k] != null);
    if (kinds.length !== 1) return err(w, '只能有 u（网址）、f（本地绝对路径）、a（页内锚点）其中一个');
    if (l.u && !/^https?:\/\//.test(l.u)) err(w, 'u 要以 http:// 或 https:// 开头');
    if (l.f) {
      const m = l.f.match(/^\{(\w+)\}/);
      const real = m ? (LOCAL[m[1]] ? l.f.replace(m[0], LOCAL[m[1]]) : null) : l.f;
      if (!m && !l.f.startsWith('/')) err(w, 'f 要写本地绝对路径，或以 {名字} 开头');
      else if (real === null) warn(w, `local.js 里没有「${m[1]}」，这条链接在本机也不会显示`);
      else if (!fs.existsSync(real)) warn(w, `本地文件不存在：${real}`);
    }
    if (l.a && !/^#(group|task|dec)-/.test(l.a)) warn(w, `锚点「${l.a}」通常是 #group-<分组id>、#task-<任务id> 或 #dec-<决策id>`);
  });
}

// 分组
const groups = new Map();
D.groups.forEach((g, i) => {
  const w = `groups[${i}]（${g && g.id}）`;
  checkKeys(w, g, 'group');
  checkId(w, g.id);
  groups.set(g.id, g);
  if (!g.name) err(w, '缺少 name');
  if (!g.short) warn(w, '没有 short，筛选按钮会显示完整 name');
  if (!COLORS.includes(g.color)) err(w, `color 只能是 ${COLORS.join(' / ')}`);
  if (!Array.isArray(g.sections) || !g.sections.length) err(w, 'sections 至少要有一项（没有小标题就写 { id, label: \'\' }）');
  const sids = new Set();
  (g.sections || []).forEach((s, j) => {
    if (!s.id) err(`${w} sections[${j}]`, '缺少 id');
    if (sids.has(s.id)) err(`${w} sections[${j}]`, `section id「${s.id}」重复`);
    sids.add(s.id);
  });
  if (g.window) {
    checkDue(w, g.window.to, 'window.to');
    if (!g.window.label) warn(w, 'window 没有 label');
  }
  checkLinks(w, g.links);
});
const usedColors = D.groups.map((g) => g.color);
usedColors.forEach((c, i) => { if (usedColors.indexOf(c) !== i) warn('groups', `颜色 ${c} 被多个分组使用，筛选和泳道里会分不清`); });

// 决策
const decs = new Map();
D.decisions.forEach((d, i) => {
  const w = `decisions[${i}]（${d && d.id}）`;
  checkKeys(w, d, 'decision');
  checkId(w, d.id);
  decs.set(d.id, d);
  if (!groups.has(d.g)) err(w, `g「${d.g}」不是已有分组`);
  if (!d.title) err(w, '缺少 title');
  if (!d.q) err(w, '缺少 q（问题说明）');
  if (d.kind != null && !['decide', 'confirm'].includes(d.kind)) err(w, 'kind 只能是 decide 或 confirm，不写就是 decide');
  checkDue(w, d.due);
  checkLinks(w, d.links);
  const vs = [];
  if (d.opts != null) {
    if (!Array.isArray(d.opts) || d.opts.length < 2) err(w, 'opts 至少两个选项');
    (d.opts || []).forEach((o, j) => {
      if (!o || typeof o.v !== 'string' || !o.v) err(`${w} opts[${j}]`, '缺少选项文字 v');
      else if (vs.includes(o.v)) err(`${w} opts[${j}]`, `选项「${o.v}」重复`);
      else vs.push(o.v);
    });
  }
  if (d.rec != null && !vs.includes(d.rec)) err(w, `rec「${d.rec}」必须和某个选项的 v 完全一样`);
  if (d.resolved != null) {
    const r = d.resolved;
    if (!r.choice && !(r.note && r.note.trim())) err(w, 'resolved 至少要有 choice 或 note');
    if (r.choice && vs.length && !vs.includes(r.choice)) err(w, `resolved.choice「${r.choice}」必须是某个选项的 v`);
    if (r.date && !DAY.test(r.date)) err(w, 'resolved.date 要写成 YYYY-MM-DD');
  }
});

// 任务
const referenced = new Set();
D.tasks.forEach((t, i) => {
  const w = `tasks[${i}]（${t && t.id}）`;
  checkKeys(w, t, 'task');
  checkId(w, t.id);
  const g = groups.get(t.g);
  if (!g) err(w, `g「${t.g}」不是已有分组`);
  else if (!(g.sections || []).some((s) => s.id === t.s)) err(w, `s「${t.s}」不是分组 ${t.g} 里的 section`);
  if (!t.title) err(w, '缺少 title');
  checkDue(w, t.due);
  if (t.done != null && (typeof t.done !== 'string' || !DAY.test(t.done))) err(w, 'done 要写完成日期 YYYY-MM-DD');
  if (t.idea && t.due) warn(w, '「以后的想法」一般不写 due');
  if (t.hot && !t.flag) warn(w, 'hot 只在有 flag 时生效');
  checkLinks(w, t.links);
  (t.dec || []).forEach((id) => {
    referenced.add(id);
    if (!decs.has(id)) err(w, `dec 里的「${id}」不是已有决策`);
  });
});
D.decisions.forEach((d) => { if (!referenced.has(d.id)) warn(`决策 ${d.id}`, '没有任务引用它（任务的 dec 里没写），只会出现在拍板区'); });

if (D.focus != null) {
  const f = D.tasks.find((t) => t.id === D.focus);
  if (!f) err('focus', `「${D.focus}」不是已有任务`);
  else if (!f.due) err('focus', `任务 ${D.focus} 没有 due`);
}

warns.forEach((m) => console.log('警告  ' + m));
errors.forEach((m) => console.log('错误  ' + m));
const open = D.tasks.filter((t) => !t.idea && !t.done).length;
console.log(`\n${D.groups.length} 个分组，${D.tasks.length} 条任务（未完成 ${open}），${D.decisions.length} 个决策 · ${errors.length} 个错误，${warns.length} 个警告`);
process.exit(errors.length ? 1 : 0);
