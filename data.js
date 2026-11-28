// 待办网页的全部内容，也是唯一数据源。字段说明和写入规则见同目录 AGENTS.md，改完运行 node check.js。
// 来源：../Todo.md（2026-11-09 全部收进来）；游戏分组来自 无限恐怖/docs/待办.md（2026-11-19 按房间制重写后同步）。
(function () {
  const DRIVE = '{drive}/Course';  // {drive} 在本机的 local.js 里解析，真实路径不进仓库
  const REPO = '/Users/zhangjunqiu/Desktop/无限恐怖';
  const DESIGN = 'https://claude.ai/artifact/9RVzroeDyBuYErDCYNThLt';

  window.TODO = {
    title: '个人 Todo',
    tzNote: '时间为新加坡时间（UTC+8）。',
    sourceFile: '/Users/zhangjunqiu/Desktop/知行合一/Background/Todo.md',
    repo: 'ZhangJunQiu-Alan/todo',  // 「提交到 GitHub」把决策开成这个仓库的 Issue
    focus: 'p-game',  // 仪表盘黑色块显示「离它截止还有几天」的任务 id

    groups: [
      {
        id: 'life', name: '个人项目与考试', short: '个人', en: 'Projects & Exam', color: 'red',
        sections: [{ id: 'life', label: '' }],
      },
      {
        id: 'course', name: '课程作业 · 2026 TR3', short: '课程', en: 'Coursework · TR3', color: 'blue',
        note: '作业截止信息来自 2026 年 11 月 6 日和 9 日的 LearnJCU 核对记录。',
        links: [{ t: '四门课的官方说明、评分表和模板', f: DRIVE + '/Assessment_资料索引.md' }],
        sections: [
          { id: 'c1124', label: '11 月 24 日（二）23:59' },
          { id: 'c1127', label: '11 月 27 日（五）13:00' },
          { id: 'c1127b', label: '11 月 27 日（五）21:59' },
          { id: 'c1129a', label: '11 月 29 日（日）21:59' },
          { id: 'c1129b', label: '11 月 29 日（日）23:59' },
          { id: 'c-review', label: '逾期待处理' },
          { id: 'ctbd', label: '具体日期待确认' },
        ],
      },
      {
        id: 'game', name: '游戏 V1 · 诸界余烬', short: '游戏', en: 'Game · Embers of the Realms', color: 'yellow',
        dueNote: 'V1 截止 · 2026 年 11 月 16 日前',
        window: { to: '2026-11-16T00:00:00+08:00', label: '游戏待办 → V1（11 月 16 日前导出）' },
        note: '来自 `无限恐怖/docs/待办.md`（2026-11-19 同步）。2026-11-19 起游戏从割草玩法改为哈迪斯式的房间制：一局连打北欧三关、每关 15 个房间，手动瞄准，角色改实时 3D，不再做像素素材。代码里还是旧玩法，按开发阶段 03–07 逐步换掉。做完的直接删掉，证据在 `assets/source/` 和 Git 历史里。',
        links: [
          { t: '武器、套装、词头与词缀设计稿', u: DESIGN },
          { t: '装备系统草案', f: REPO + '/docs/装备系统草案/index.html' },
          { t: '原待办.md', f: REPO + '/docs/待办.md' },
          { t: '游戏设定 · 核心规则', f: REPO + '/docs/游戏设定.md' },
          { t: '剑士 3D 试点', f: REPO + '/docs/Codex_剑士3D试点/README.md' },
        ],
        sections: [
          { id: 'g-s03', label: '03 · 核心战斗' },
          { id: 'g-s04', label: '04 · 房间推进' },
          { id: 'g-s05', label: '05 · 剧情系统' },
          { id: 'g-s06', label: '06 · 扩展北欧三关' },
          { id: 'g-s07', label: '07 · 整体打磨' },
          { id: 'g-artui', label: '美术与界面' },
          { id: 'g-eng', label: '工程' },
          { id: 'g-decide', label: '装备系统 · 等你定的' },
          { id: 'g-code', label: '装备系统 · Claude（代码）' },
          { id: 'g-tbd', label: '待定的设计和数值' },
          { id: 'g-later', label: '以后的想法（没排期）' },
        ],
      },
    ],

    tasks: [
      // ── 个人项目与考试
      { id: 'p-game', g: 'life', s: 'life', short: '游戏 V1', due: '2026-11-16T00:00:00+08:00', dueText: '2026 年 11 月 16 日前',
        title: '游戏 V1', desc: '定下 V1 的玩法与开发范围，完成开发、试玩检查，并导出一个可玩的版本。',
        links: [{ t: '游戏待办明细', a: '#group-game' }], dec: ['d-v1'] },
      { id: 'p-site', g: 'life', s: 'life', short: '作品集', due: '2026-11-20T00:00:00+08:00', dueText: '2026 年 11 月 20 日前',
        title: '个人作品集网站', desc: '整理要展示的项目，完成网站开发，检查桌面端、移动端和项目链接。', dec: ['d-portfolio'] },
      { id: 'p-ielts', g: 'life', s: 'life', short: '雅思', due: '2027-02-09T00:00:00+08:00', dueText: '2027 年 2 月 9 日前',
        title: '参加一次雅思考试', desc: '确定考试类别和场次，完成报名并参加考试。具体考试日期待定。', dec: ['d-ielts'] },
      { id: 'p-ielts-mock', g: 'life', s: 'life', short: '雅思模考', due: '2026-11-17T23:59:00+08:00', dueText: '2026 年 11 月 17 日（今天）', owner: '你',
        title: '雅思模考：一套剑桥真题（机考形式）',
        desc: '在电脑上按顺序做：听力 30 分钟 → 阅读 60 分钟 → 写作 60 分钟（Task 1 20 分钟，Task 2 40 分钟）。口语用语音 AI 模拟一轮并录音。做完把答案、标准答案和作文交给 Claude 分析。',
        links: [{ t: '备考档案', f: '/Users/zhangjunqiu/Desktop/雅思备考/记录/档案.md' }] },
      { id: 'p-masters-ps', g: 'life', s: 'life', title: '找一下NUS,NTU,SIT,SUTD相关的硕士项目后完成PS', dueText: '日期待确认' },

      // ── 课程作业
      { id: 'c-3405a2a', g: 'course', s: 'c1129a', due: '2026-11-29T21:59:00+08:00', short: '设计思维',
        title: 'Design Thinking III · A2 Part A Scrum Project Activities', meta: '小组，25%',
        desc: '提交 Weeks 5–9 的 Scrum 证据，包括 Backlog、Definition of Done、角色轮换和每轮改进记录。',
        links: [{ t: '团队提交', u: 'https://learn.jcu.edu.au/ultra/courses/_186997_1/assessment/_9756247_1/overview?courseId=_186997_1' }] },
      { id: 'c-3405a2b', g: 'course', s: 'c1129a', due: '2026-11-29T21:59:00+08:00', short: '设计思维',
        title: 'Design Thinking III · A2 Part B Individual Reflective Report', meta: '个人，5%',
        desc: '用 Gibbs 循环分析一次正向经历和一次挑战，合计约 500 字（±10%）。',
        links: [{ t: '个人提交', u: 'https://learn.jcu.edu.au/ultra/courses/_186997_1/assessment/_9756250_1/overview?courseId=_186997_1' }] },
      { id: 'c-3102a2', g: 'course', s: 'c1129b', due: '2026-11-29T23:59:00+08:00', short: '跨学科项目',
        title: 'Multidisciplinary Project · A2 Reflective Journal', meta: '个人，15%',
        desc: '约 1,000 字，结合实际项目经历反思跨专业合作与职业发展。',
        links: [{ t: '课程考核区', u: 'https://learn.jcu.edu.au/ultra/courses/_191513_1/outline' }] },
      { id: 'c-3405a3a', g: 'course', s: 'c1129b', due: '2026-11-29T23:59:00+08:00', short: '设计思维',
        title: 'Design Thinking III · A3 Part A Design Sprint Activities', meta: '小组，25%',
        desc: '用 FigJam 和 Figma 整理从问题理解到原型测试和迭代的证据。',
        links: [{ t: '课程考核区', u: 'https://learn.jcu.edu.au/ultra/courses/_186997_1/outline' }] },
      { id: 'c-3405a3b', g: 'course', s: 'c1129b', due: '2026-11-29T23:59:00+08:00', short: '设计思维',
        title: 'Design Thinking III · A3 Part B Individual Reflection', meta: '个人，5%',
        desc: '用 Gibbs 写约 500 字，分析一次有效引导和一次困难经历，引用 Sprint 产物作为证据。',
        links: [{ t: '课程考核区', u: 'https://learn.jcu.edu.au/ultra/courses/_186997_1/outline' }] },

      // ── 游戏：03 核心战斗
      { id: 'g-tripo', g: 'game', s: 'g-s03', title: 'Tripo Pro 自动续费', owner: '你', short: 'Tripo 续费',
        due: '2026-12-18T00:00:00+08:00', dueText: '2026 年 12 月 18 日前（以 Tripo 账单上的续费日为准）',
        desc: '2026-11-19 订了 Pro 3k 按月，首月 $14，之后每月 $20。教育认证批下来、或者模型下完暂时不用时，在扣费前取消续费。' },
      { id: 'g-swweapons', g: 'game', s: 'g-s03', title: '剑士 11 把武器的 3D 模型（连刀鞘）', owner: 'Claude', flag: '太刀已完成',
        desc: '角色身体不带武器，武器挂在右手和左腰挂点。太刀已在 Blender 里建模并换进游戏（2026-11-20 验收通过），其余 10 把照同样的坐标做。' },

      // ── 游戏：04 房间推进
      { id: 'g-rooms', g: 'game', s: 'g-s04', title: '房间切换和一关 15 间的编排', owner: 'Claude',
        desc: '清房开门、进入下一间、回头路关闭。Boss 固定第 15 间，前 14 间按类型数量随机排序。' },
      { id: 'g-mmap', g: 'game', s: 'g-s04', title: '路线总览地图（按 M）',
        desc: '15 个房间的路径图，房间类型图标、走过/当前/未到三种状态，打开时暂停。图标样式和信息量要设计。',
        links: [{ t: '地图设计', f: REPO + '/docs/地图设计.md' }] },
      { id: 'g-chest', g: 'game', s: 'g-s04', title: '清房宝箱掉装备', owner: '你',
        desc: '各类房间宝箱的品质和数量要你定。', dec: ['d-chest'] },
      { id: 'g-xp', g: 'game', s: 'g-s04', title: '经验和等级按 45 个房间重调', owner: 'Claude',
        desc: '经验量、成型和觉醒时间、稀有度随房间数提升的数值。' },
      { id: 'g-boons', g: 'game', s: 'g-s04', title: '八位神改写成动作祝福', owner: 'Claude',
        desc: '神术从自动释放改成附着在普通攻击、特殊攻击、冲刺、大招上，或不占动作的被动。Claude 出稿，你审。',
        links: [{ t: '局内成长与信仰', f: REPO + '/docs/局内成长与信仰.md' }] },
      { id: 'g-miniboss', g: 'game', s: 'g-s04', title: '小 Boss 放进精英挑战房', owner: 'Claude',
        desc: '第 15 间只打大 Boss；代码里还是按时间刷三个 Boss。' },
      { id: 'g-units', g: 'game', s: 'g-s04', title: '距离数值按「身位」换算到新角色尺寸', owner: 'Claude',
        desc: '接入新角色时试玩调整。' },

      // ── 游戏：05 剧情系统
      { id: 'g-story', g: 'game', s: 'g-s05', title: '回忆水晶球、可跳过的主线 CG、永久图鉴',
        links: [{ t: '游戏设定', f: REPO + '/docs/游戏设定.md' }] },

      // ── 游戏：06 扩展北欧三关
      { id: 'g-levels', g: 'game', s: 'g-s06', title: '三关各 15 个房间的题材和布局',
        links: [{ t: '地图设计', f: REPO + '/docs/地图设计.md' }] },
      { id: 'g-atlas', g: 'game', s: 'g-s06', title: '更新房间图鉴', owner: 'Claude',
        desc: '里面还是 7 个房间、分岔选门的旧草案。', links: [{ t: '房间图鉴', f: REPO + '/docs/芬布尔之冬房间图鉴/index.html' }] },

      // ── 游戏：07 整体打磨
      { id: 'g-audio', g: 'game', s: 'g-s07', title: '音频听感', owner: '你',
        desc: '早期 54 个音效和 6 首音乐的听感与循环；神术音效在实际战斗里的触发和密集时的混音。' },
      { id: 'g-i18n', g: 'game', s: 'g-s07', title: '多语言和设备',
        desc: '只验过中英文、三种窗口尺寸。' },
      { id: 'g-win', g: 'game', s: 'g-s07', title: 'Windows',
        desc: '2026-10-22 已导出旧版 Windows 包（`build/windows_2026-10-22/`），但没在 Windows 真机上跑过；输入、手柄、音频、存档兼容都没测。目标是上 Steam（2026-11-10 定）。' },
      { id: 'g-tm', g: 'game', s: 'g-s07', title: '改叫法和商标检索',
        desc: '正式发布前：「主神」「主神空间」「轮回者」换成自己的叫法；游戏名和技能名做商标检索。', dec: ['d-rename'] },

      // ── 游戏：美术与界面
      { id: 'g-ui', g: 'game', s: 'g-artui', title: '界面样张', owner: 'Codex',
        desc: '按古典碑刻 + 深蓝星图方向出几版主菜单、战斗 HUD、祝福选择、装备栏样张，你选定后替换现在的像素界面。' },
      { id: 'g-icons', g: 'game', s: 'g-artui', title: '装备、素材、货币图标', owner: 'Codex',
        desc: '手绘，不画稀有度。界面风格定了以后重新出任务书。原来的像素图标任务（套装防具 S-SET、S-ART-04）已作废。' },
      { id: 'g-heroes3d', g: 'game', s: 'g-artui', title: '枪手、刺客、法师的画风和 3D 模型', owner: 'Codex',
        desc: '按出身换笔触，等剑士试点跑通后做。' },
      { id: 'g-art04', g: 'game', s: 'g-artui', title: '装备音效 S-SFX-01', owner: 'Codex',
        desc: '可以开工。', links: [{ t: '装备音效任务', f: REPO + '/docs/Codex_装备音效任务.md' }] },
      { id: 'g-mindmap', g: 'game', s: 'g-artui', title: '重画一版游戏思维导图',
        desc: '房间制文档都改完以后。' },

      // ── 游戏：工程
      { id: 'g-locale', g: 'game', s: 'g-eng', title: '清掉 3 条没人用的翻译', tag: '复查新增', owner: 'Claude',
        desc: '`tools/check_translations.py` 报的：「指甲堆」「锚链」「【主神】」。' },

      // ── 游戏：等你定的
      { id: 'g-hero', g: 'game', s: 'g-decide', title: '枪手换成狂野比尔·希科克、法师换成浮士德', owner: '你',
        desc: '2026-11-10 定。外观、初始武器、被动、大招和特写台词要重新设计，Claude 出稿后你审。法师被动「先知」一起改。' },
      { id: 'g-30', g: 'game', s: 'g-decide', title: '枪手、刺客、法师的 30 把武器', owner: '你',
        desc: '还没按剑士的标准审过。复查补充：射日弓、电气猎枪是延迟伤害，按剑士规矩本来就要改。武器名带人名（2026-11-10 定）：只改原来描述性的名字（例如苹果弩改成退尔之弩），本身有名的不动，具体哪几把一起审。', links: [{ t: '设计稿', u: DESIGN }], dec: ['d-30'] },
      { id: 'g-9q', g: 'game', s: 'g-decide', title: '设计稿「需要你拍板」一节的 7 个问题', owner: '你',
        desc: '神器要不要重写、词头分类、词缀种类、坏词缀方案等。「30 把要换哪些」和「两组规则接近」并入上一条，「神器要不要重写」并入下一条，剩下 4 个在底部决策区。',
        links: [{ t: '设计稿', u: DESIGN }], dec: ['d-drop', 'd-prefix', 'd-affix', 'd-bad'] },
      { id: 'g-art', g: 'game', s: 'g-decide', title: '神器', owner: '你',
        desc: '屠龙者套的「挡下一次伤害」和霜王盔、守护符文重复，审神器时改掉霜王盔。', dec: ['d-art'] },

      // ── 游戏：Claude 代码
      { id: 'g-six', g: 'game', s: 'g-code', title: '六步接入', owner: 'Claude',
        desc: '按草案「六步接入」做强化、分解、词头词缀、神器。已接入：主神空间「装备」页（五个部位、行囊、详情，剑士的 11 把武器也在这里选）、10 套套装效果、结算和存档。', links: [{ t: '装备系统草案', f: REPO + '/docs/装备系统草案/index.html' }] },
      { id: 'g-data', g: 'game', s: 'g-code', title: '同步草案数据', owner: 'Claude',
        desc: '把 `docs/装备系统草案/data.js` 的套装换成 `docs/装备系统_已确认.md` 里的 10 套，剑士武器换成设计稿里的新版。' },
      { id: 'g-names', g: 'game', s: 'g-code', title: '角色只显示人名', owner: 'Claude',
        desc: '2026-11-10 定：剑士→宫本武藏、刺客→兰陵王、枪手→狂野比尔·希科克、法师→浮士德。枪手、法师等新设计审完一起改。' },
      { id: 'g-card', g: 'game', s: 'g-code', title: '武器强化卡（草案 TODO 1）', owner: 'Claude',
        desc: '新武器的独有规则会和现有武器卡冲突，例如「双刃·三连刺」。' },
      { id: 'g-clone', g: 'game', s: 'g-code', title: '英灵分身挂上玩家的武器', owner: 'Claude',
        desc: '现在是空手挥砍（伤害和出手间隔按玩家的武器算）；猛志「逐层消失」暂定每秒掉一层。' },

      // ── 游戏：待定的设计和数值
      { id: 'g-prophet', g: 'game', s: 'g-tbd', title: '法师被动「先知」',
        desc: '是「升级四选一」，但现在所有角色升级都是四选一，等于没有被动，要重新设计。法师换成浮士德时一起改。', dec: ['d-prophet'] },
      { id: 'g-fate', g: 'game', s: 'g-tbd', title: '改写命运的奖励',
        desc: '改写命运现在不加奖励点（`FATE_REWARD = 0`），要定公式。', dec: ['d-fate'] },

      // ── 游戏：以后的想法
      { id: 'g-faith', g: 'game', s: 'g-later', idea: true, title: '信仰：放逐、房间里的神像、三神传说',
        links: [{ t: '局内成长与信仰', f: REPO + '/docs/局内成长与信仰.md' }] },
      { id: 'g-egg', g: 'game', s: 'g-later', idea: true, title: '第 1 关「察觉者」彩蛋',
        desc: '老歌者和刻满计数痕的符文石。', links: [{ t: '世界观', f: REPO + '/docs/世界观设定.md' }] },
      { id: 'g-next', g: 'game', s: 'g-later', idea: true, title: '后续篇章',
        desc: '西行、封神、山海经等（世界观第三节）。' },
      { id: 'g-sidequest', g: 'game', s: 'g-later', idea: true, title: '交互式支线事件',
        desc: '游戏设定「剧情呈现方式」第三层。' },
    ],

    // kind: decide = 要你拍板；confirm = 要你查到后填
    decisions: [
      { id: 'd-v1', g: 'life', title: '游戏 V1 的玩法与开发范围', due: '2026-11-16T00:00:00+08:00',
        q: '11 月 16 日前要导出可玩版本。装备系统还没接进游戏：剑士武器层和六步接入（掉落、背包、强化、分解）都没做；验收里性能和真人通关也还没过。',
        opts: [{ v: 'V1 不含装备系统，先过验收' }, { v: 'V1 只含剑士武器层' }, { v: 'V1 含完整装备系统' }],
        resolved: { choice: 'V1 含完整装备系统', date: '2026-11-09' } },
      { id: 'd-portfolio', g: 'life', title: '作品集网站展示哪些项目', due: '2026-11-20T00:00:00+08:00',
        q: '11 月 20 日前完成网站。先定要展示的项目，写在下面。',
        resolved: { note: 'Primoria和这款游戏肯定是要展示的,还有什么你推荐我展示, 我想的是 做成那种scroll-triggered split-screen transitions', date: '2026-11-09' } },
      { id: 'd-ielts', g: 'life', title: '雅思考试类别和场次', due: '2027-02-09T00:00:00+08:00',
        q: '2027 年 2 月 9 日前考一次。选类别，场次写在下面。',
        opts: [{ v: '学术类 Academic' }, { v: '培训类 General Training' }],
        resolved: { choice: '学术类 Academic', note: '场次还没确定,我之前考过 只有5,5,5,5', date: '2026-11-09' } },


      { id: 'd-30', g: 'game', title: '枪手、刺客、法师的 30 把武器',
        q: '按剑士的规矩审：伤害一直正常（不打零、不前期弱、不延迟）；不撞信仰和大招；不猜敌人出手时机；规则读起来像武器自己的招式；常态倍率不超过 ×2.5。射日弓和电气猎枪是延迟伤害，要改。巨石阵之杖和轰天雷都是在地上放东西，要不要换掉一把？',
        opts: [{ v: '巨石阵之杖、轰天雷换掉一把' }, { v: '两把都留' }],
        links: [{ t: '设计稿', u: DESIGN }] },
      { id: 'd-art', g: 'game', title: 'Boss 和命运的 11 件神器防具',
        q: '要不要按同样的标准重写？屠龙者套的「挡下一次伤害」和霜王盔、守护符文重复，至少要改霜王盔。',
        opts: [{ v: '11 件全部重写' }, { v: '只改霜王盔' }] },
      { id: 'd-drop', g: 'game', title: '武器掉落怎么分',
        q: '继续按关卡分（每关 4 / 3 / 3 把），还是以后按篇章分（例如芭蕉扇、紫金红葫芦归「西行」）？',
        opts: [{ v: '按关卡' }, { v: '按篇章' }] },
      { id: 'd-prefix', g: 'game', title: '词头分类',
        q: '词头按「良品 / 双刃 / 瑕品」三类，武器词头按机制标签分池？',
        opts: [{ v: '同意' }, { v: '要改' }] },
      { id: 'd-affix', g: 'game', title: '随机词缀种类和档位',
        q: '随机词缀加入「条件」和「机制」两种，并显示 Ⅰ–Ⅴ 档？',
        opts: [{ v: '同意' }, { v: '要改' }] },
      { id: 'd-bad', g: 'game', title: '坏词缀方案',
        q: '设计稿推荐 A + C：低稀有度的纯坏词缀保持现状，史诗和传说多一种好坏绑定的诅咒。',
        rec: 'A + C',
        opts: [
          { v: 'A 保持现状', d: '纯坏处，红字 ▼。坏词缀几率：普通 35%、稀有 20%、史诗 10%。和团队意见一致，简单；但玩家容易觉得「掉的都是垃圾」。' },
          { v: 'B 瑕疵可以洗', d: '和 A 一样，但强化到 +3 时可以花金币洗掉一条坏词缀。低稀有度也有养成价值；多一个小系统。' },
          { v: 'C 加入「诅咒」', d: 'A 不变，史诗和传说另有 5% 几率出一条诅咒，好坏绑在一起，例如「玻璃心：伤害 +12%，最大生命 -12%」。高稀有度也有取舍和话题；数值要更小心地调。' },
          { v: 'A + C' },
        ] },
      { id: 'd-prophet', g: 'game', title: '法师被动「先知」怎么改',
        q: '现在写的是「每次升级从四个选项中选择一个」，所有角色都这样，等于没有被动。新被动写在下面。' },
      { id: 'd-fate', g: 'game', title: '改写命运的奖励公式',
        q: '现在 `FATE_REWARD = 0`，改写命运不加奖励点。' },
      { id: 'd-chest', g: 'game', title: '各类房间清房宝箱的品质和数量',
        q: '清完一间战斗房掉宝箱，宝箱里是装备。普通战斗、特殊战斗、精英挑战、极限生存、契约试炼各掉什么品质、几件，写在下面。' },
      { id: 'd-rename', g: 'game', title: '「主神」「主神空间」「轮回者」的新叫法',
        q: '正式发布前要换成自己的叫法。游戏名和技能名也要做商标检索。' },
    ],
  };
})();
