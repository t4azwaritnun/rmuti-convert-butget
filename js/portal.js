const PROJECTS = [
  {
    "src": "tools/strategy/index.html",
    "icon": "📊",
    "title": "แปลงข้อมูลยุทธศาสตร์ → Power BI",
    "tone": "blue",
    "kind": "bars",
    "desc": "แปลงไฟล์ Excel ยุทธศาสตร์ให้นำเข้า Power BI ได้ทันที"
  },
  {
    "src": "tools/income-expense/index.html",
    "icon": "💰",
    "title": "ETL รายรับ-รายจ่าย มทร.อีสาน",
    "tone": "green",
    "kind": "line",
    "desc": "รวมและจัดรูปข้อมูลรายรับ-รายจ่ายจากไฟล์ Excel"
  },
  {
    "src": "tools/budget/index.html",
    "icon": "🏛️",
    "title": "Budget ETL — รายจ่ายงบแผ่นดิน",
    "tone": "amber",
    "kind": "stack",
    "desc": "จัดรูปข้อมูลรายจ่ายงบแผ่นดินจากไฟล์ Excel"
  }
];
const $ = id => document.getElementById(id);
const ART = {
  bars:'<svg viewBox="0 0 240 130" aria-hidden="true"><g fill="currentColor"><rect x="14" y="78" width="30" height="52" rx="5" opacity=".4"/><rect x="60" y="52" width="30" height="78" rx="5" opacity=".6"/><rect x="106" y="30" width="30" height="100" rx="5" opacity=".8"/><rect x="152" y="8" width="30" height="122" rx="5"/></g><path d="M196 96l14-14 14 14" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  line:'<svg viewBox="0 0 240 130" aria-hidden="true"><g stroke="currentColor" stroke-width="2" opacity=".25"><path d="M0 40h240M0 80h240M0 120h240"/></g><polyline points="6,108 46,84 86,92 126,52 166,62 206,22" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><g fill="var(--panel)" stroke="currentColor" stroke-width="5"><circle cx="46" cy="84" r="7"/><circle cx="126" cy="52" r="7"/><circle cx="206" cy="22" r="7"/></g></svg>',
  stack:'<svg viewBox="0 0 240 130" aria-hidden="true"><g fill="currentColor"><rect x="6" y="14" width="228" height="26" rx="6" opacity=".25"/><rect x="6" y="14" width="150" height="26" rx="6"/><rect x="6" y="52" width="228" height="26" rx="6" opacity=".25"/><rect x="6" y="52" width="104" height="26" rx="6" opacity=".7"/><rect x="6" y="90" width="228" height="26" rx="6" opacity=".25"/><rect x="6" y="90" width="186" height="26" rx="6" opacity=".5"/></g></svg>'
};
PROJECTS.forEach((p,i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'card ' + p.tone;
  b.innerHTML = '<div class="art">'+ART[p.kind]+'</div><div class="body"><h2></h2><p></p><span class="go">เปิดเครื่องมือ</span></div>';
  b.querySelector('h2').textContent = p.title;
  b.querySelector('p').textContent = p.desc;
  b.onclick = () => open_(i);
  $('grid').appendChild(b);
});
function open_(i){
  $('ttl').textContent = PROJECTS[i].title;
  $('frame').src = PROJECTS[i].src;
  $('home').style.display = 'none';
  $('view').style.display = 'flex';
  history.replaceState(null,'','#p'+(i+1));
}
function close_(){
  $('frame').src = 'about:blank';
  $('view').style.display = 'none';
  $('home').style.display = 'flex';
  history.replaceState(null,'',location.pathname);
  window.scrollTo(0,0);
}
$('back').onclick = close_;
$('yr').textContent = new Date().getFullYear();
const m = location.hash.match(/^#p(\d+)$/);
if (m && PROJECTS[m[1]-1]) open_(m[1]-1);
