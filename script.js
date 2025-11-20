const mockRooms = [
  {
    name: '会议室 A',
    meetingTitle: '产品路线评审会',
    currentTopic: '版本 2.3 需求优先级讨论',
    otherTopics: ['风险与资源评估', '技术架构评审', '上线计划确认'],
    upcoming: { title: '跨部门协同会', time: '14:00 - 15:00' },
    status: 'busy' // 进行中
  },
  {
    name: '会议室 B',
    meetingTitle: '季度 OKR 对齐',
    currentTopic: '市场增长目标细化',
    otherTopics: ['销售激励方案', '预算分配讨论'],
    upcoming: { title: '预算审议会', time: '15:30 - 16:30' },
    status: 'soon' // 待开始
  },
  {
    name: '会议室 C',
    meetingTitle: '数据平台技术分享',
    currentTopic: '数据血缘与治理',
    otherTopics: ['实时数仓架构', '数据质量监控', '性能优化方案'],
    upcoming: { title: 'SRE 每周例会', time: '16:30 - 17:30' },
    status: 'free' // 无会议
  }
];

const STATUS_META = {
  busy: { label: '进行中', badgeClass: 'status-busy', accent: '#dc2626' },
  soon: { label: '待开始', badgeClass: 'status-soon', accent: '#1d4ed8' },
  free: { label: '无会议', badgeClass: 'status-free', accent: '#16a34a' }
};

function formatNow() {
  const now = new Date();
  const d = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const t = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  return { date: d, time: t };
}

function renderRooms(rooms) {
  const container = document.getElementById('rooms');
  container.innerHTML = rooms.map(r => {
    const avatar = getRoomAvatar(r.name);
    const meta = STATUS_META[r.status] || STATUS_META.free;
    const otherTopicsHtml = r.otherTopics.map((topic, index) => `
      <div class="topic-item">
        <span class="topic-number">${index + 1}</span>
        <span class="topic-text">${topic}</span>
      </div>
    `).join('');
    
    return `
    <section class="room-card" style="--accent: ${meta.accent}">
      <div class="timeline"></div>
      <div class="room-header">
        <div class="room-meta">
          <div class="room-avatar" aria-hidden="true">${avatar}</div>
          <h2 class="room-name">${r.name}</h2>
        </div>
        <span class="status-badge ${meta.badgeClass}">
          <span class="dot"></span>${meta.label}
        </span>
      </div>

      <div class="section">
        <div class="section-title">会议名称</div>
        <div class="meeting-title">${r.meetingTitle}</div>
      </div>

      <div class="section">
        <div class="section-title">当前议题</div>
        <div class="topic-card current">
          <div class="topic">${r.currentTopic}</div>
          <span class="chip chip-live"><span class="dot"></span>当前</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">其他议题</div>
        <div class="topic-card upcoming">
          <div class="topics-list">
            ${otherTopicsHtml}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">下一场会议</div>
        <div class="row">
          <div class="topic text-strong">${r.upcoming.title}</div>
          <div class="meeting-time">${r.upcoming.time}</div>
        </div>
      </div>
    </section>`;
  }).join('');
}

function tickNow() {
  const { date, time } = formatNow();
  document.getElementById('now-time').textContent = time;
  document.getElementById('now-date').textContent = date;
}

function init() {
  renderRooms(mockRooms);
  tickNow();
  setInterval(tickNow, 1000 * 60);
  setupThemeToggle();
}

document.addEventListener('DOMContentLoaded', init);

function getRoomAvatar(name) {
  if (!name) return '?';
  const trimmed = String(name).trim();
  return trimmed.charAt(trimmed.length - 1).toUpperCase();
}

function setupThemeToggle() {
  const key = 'theme-preference';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem(key);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(key, next);
  });
  // Listen to system changes only if no manual choice
  if (!saved) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      applyTheme(e.matches ? 'dark' : 'light');
    });
  }
}

function applyTheme(mode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  if (mode === 'dark') {
    document.body.classList.add('is-dark');
  } else {
    document.body.classList.remove('is-dark');
  }
}


