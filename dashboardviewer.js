// dashboardviewer.js
const user = JSON.parse(localStorage.getItem('ge_user') || '{}');
const username = user.username || 'Viewer';
const email = user.email || 'viewer@greenenergy.io';
const initials = username.charAt(0).toUpperCase();

document.getElementById('userName').textContent = username;
document.getElementById('userEmail').textContent = email;
document.getElementById('greetName').textContent = `Hello, ${username}!`;
document.getElementById('greetEmail').textContent = `${email} · Viewer`;
document.getElementById('userAvatar').textContent = initials;
document.getElementById('profileAvatar').textContent = initials;
document.getElementById('profileName').textContent = username;
document.getElementById('profileEmail').textContent = email;

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const titles = {
  overview:'Overview', energy:'Energy Feed', sites:'Sites Map',
  reports:'Reports', gallery:'Gallery', news:'News', learn:'Learn',
  profile:'My Profile', settings:'Settings'
};
navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const target = item.dataset.page;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + target).classList.add('active');
    pageTitle.textContent = titles[target] || target;
    if (window.innerWidth <= 768) closeSidebar();
  });
});

// Mobile sidebar
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

// Live energy feed
const feedData = [
  { name:'Rajasthan Solar Park', val:'1.2 MW', on:true },
  { name:'Gujarat Wind Farm', val:'0.9 MW', on:true },
  { name:'Kerala Micro-Hydro', val:'0.6 MW', on:true },
  { name:'Delhi Smart Grid', val:'1.5 MW', on:true },
  { name:'Mumbai Battery Hub', val:'74% charged', on:true },
  { name:'Tamil Nadu Offshore', val:'2.1 MW', on:true },
  { name:'Pune Solar Rooftop', val:'0.3 MW', on:false }
];
const feedEl = document.getElementById('energyFeed');
function renderFeed() {
  if(!feedEl) return;
  feedEl.innerHTML = feedData.map(f => {
    const now = new Date();
    const t = now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
    return `<div class="feed-item"><div class="feed-dot ${f.on?'on':'off'}"></div><span class="feed-label">${f.name}</span><span class="feed-val">${f.val}</span><span class="feed-time">${t}</span></div>`;
  }).join('');
}
renderFeed();
setInterval(renderFeed, 5000);