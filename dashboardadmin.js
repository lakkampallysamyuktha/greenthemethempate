// dashboardadmin.js
const user = JSON.parse(localStorage.getItem('ge_user') || '{}');
const username = user.username || 'Admin';
const email = user.email || 'admin@greenenergy.io';
const initials = username.charAt(0).toUpperCase();

document.getElementById('userName').textContent = username;
document.getElementById('userEmail').textContent = email;
document.getElementById('greetName').textContent = `Hello, ${username}!`;
document.getElementById('greetEmail').textContent = `${email} · Administrator`;
document.getElementById('userAvatar').textContent = initials;

const mOutput = document.getElementById('mOutput');
function updateOutput() { mOutput.textContent = (4.2 + Math.random() * 1.2).toFixed(1) + ' MW'; }
updateOutput();
setInterval(updateOutput, 4000);

const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const titles = {
  overview:'Overview', metrics:'Metrics', sites:'Site Manager', alerts:'Alerts',
  users:'Users', devices:'Devices', reports:'Reports', billing:'Billing',
  logs:'System Logs', settings:'Settings'
};
navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const target = item.dataset.page;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    pages.forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('page-' + target);
    if (pg) pg.classList.add('active');
    pageTitle.textContent = titles[target] || target;
    if (window.innerWidth <= 768) closeSidebar();
    if (target === 'metrics') drawBigChart();
    if (target === 'logs') renderLogs();
  });
});

const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('overlay');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  if(hamburger){
    hamburger.classList.add('open');
    const icon = hamburger.querySelector('i');
    if(icon) icon.className = 'ph ph-x';
  }
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  if(hamburger){
    hamburger.classList.remove('open');
    const icon = hamburger.querySelector('i');
    if(icon) icon.className = 'ph ph-list';
  }
}
hamburger?.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
overlay?.addEventListener('click', closeSidebar);
sidebarCloseBtn?.addEventListener('click', closeSidebar);
window.addEventListener('resize', () => { if(window.innerWidth > 768 && sidebar.classList.contains('open')) closeSidebar(); });

const barData = [55,70,60,80,95,85,78,88,72,68,90,82,74,86,92,79,83,77,88,96,84,76,90,88];
const chartArea = document.getElementById('chartArea');
if(chartArea){
  const maxVal = Math.max(...barData);
  barData.forEach(v => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = (v / maxVal * 100) + '%';
    bar.title = v + ' kW';
    chartArea.appendChild(bar);
  });
}

const siteData = [
  { name:'Rajasthan Solar', pct:92 },
  { name:'Gujarat Wind',    pct:76 },
  { name:'Kerala Hydro',    pct:84 },
  { name:'Delhi Grid',      pct:98 },
  { name:'Tamil Offshore',  pct:88 }
];
const siteRows = document.getElementById('siteRows');
if(siteRows){
  siteData.forEach(s => {
    const row = document.createElement('div');
    row.className = 'site-row';
    row.innerHTML = `<span class="site-row-name">${s.name}</span><div class="site-row-bar-wrap"><div class="site-row-bar" style="width:${s.pct}%"></div></div><span class="site-row-pct">${s.pct}%</span>`;
    siteRows.appendChild(row);
  });
}

function drawBigChart(){
  const canvas = document.getElementById('bigChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 700;
  canvas.height = canvas.offsetHeight || 260;
  const W = canvas.width, H = canvas.height;
  const vals = Array.from({length:24}, (_,h) => (h < 6 || h > 20) ? 0.2 + Math.random() * 0.3 : 2 + Math.random() * 2.8);
  const maxV = Math.max(...vals);
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  [0.25,0.5,0.75,1].forEach(f => { const y = H - f * (H - 30) - 30; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); });
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, 'rgba(16,185,129,0.25)');
  grad.addColorStop(1, 'rgba(16,185,129,0.02)');
  ctx.beginPath();
  vals.forEach((v,i) => { const x = (i / 23) * W; const y = H - (v / maxV) * (H - 40) - 20; i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y); });
  ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
  vals.forEach((v,i) => { const x = (i / 23) * W; const y = H - (v / maxV) * (H - 40) - 20; i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y); });
  ctx.stroke();
}

const logMessages = [
  { level:'ok', msg:'Site GE-RAJ-001: Output nominal at 1.24 MW' },
  { level:'info', msg:'User priya@ge.io signed in from 103.x.x.x' },
  { level:'warn', msg:'Mumbai Battery Hub: SOC dropped below 30%' },
  { level:'ok', msg:'Daily backup completed — 240 MB archived' },
  { level:'info', msg:'API call: GET /v1/sites/all — 200 OK' },
  { level:'ok', msg:'Gujarat Wind: connectivity restored' },
  { level:'warn', msg:'Rajasthan Solar: Panel efficiency 82%' }
];
function renderLogs(){
  const terminal = document.getElementById('logTerminal');
  if(!terminal) return;
  terminal.innerHTML = '';
  const now = new Date();
  logMessages.forEach((l,i) => {
    const t = new Date(now - i * 320000);
    const ts = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}:${t.getSeconds().toString().padStart(2,'0')}`;
    const line = document.createElement('div'); line.className = 'log-line';
    line.innerHTML = `<span class="log-time">${ts}</span><span class="log-level-${l.level}">[${l.level.toUpperCase()}]</span><span class="log-msg">${l.msg}</span>`;
    terminal.appendChild(line);
  });
  terminal.scrollTop = terminal.scrollHeight;
}