// ======= DEFAULT MAPPING =======
const DEFAULT_MAP = [
  { sheet:'คบธ',          campus:'นครราชสีมา', type:'คณะ',          unit:'คณะบริหารธุรกิจ' },
  { sheet:'ควท',          campus:'นครราชสีมา', type:'คณะ',          unit:'คณะวิศวกรรมศาสตร์และเทคโนโลยี' },
  { sheet:'ควศ',          campus:'นครราชสีมา', type:'คณะ',          unit:'คณะวิทยาศาสตร์และศิลปศาสตร์' },
  { sheet:'คสศ',          campus:'นครราชสีมา', type:'คณะ',          unit:'คณะสถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์' },
  { sheet:'คนท',          campus:'นครราชสีมา', type:'คณะ',          unit:'คณะนวัตกรรมและเทคโนโลยีการเกษตร' },
  { sheet:'ครข',          campus:'นครราชสีมา', type:'คณะ',          unit:'คณะระบบรางและการขนส่ง' },
  { sheet:'สสศ',          campus:'นครราชสีมา', type:'สำนัก/สถาบัน', unit:'สถาบันสหสรรพศาสตร์' },
  { sheet:'คกท',          campus:'สุรินทร์',   type:'คณะ',          unit:'คณะเกษตรศาสตร์และเทคโนโลยี' },
  { sheet:'คทจ',          campus:'สุรินทร์',   type:'คณะ',          unit:'คณะเทคโนโลยีการจัดการ' },
  { sheet:'คว',           campus:'ขอนแก่น',   type:'คณะ',          unit:'คณะวิศวกรรมศาสตร์' },
  { sheet:'คคอ',          campus:'ขอนแก่น',   type:'คณะ',          unit:'คณะครุศาสตร์อุตสาหกรรม' },
  { sheet:'คบท',          campus:'ขอนแก่น',   type:'คณะ',          unit:'คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ' },
  { sheet:'คอท',          campus:'สกลนคร',    type:'คณะ',          unit:'คณะอุตสาหกรรมและเทคโนโลยี' },
  { sheet:'คทธ',          campus:'สกลนคร',    type:'คณะ',          unit:'คณะทรัพยากรธรรมชาติ' },
  { sheet:'สนง.วข.ขก.',  campus:'ขอนแก่น',   type:'สำนัก/สถาบัน', unit:'สำนักงานวิทยาเขตขอนแก่น' },
  { sheet:'สนง.วข.สร.',  campus:'สุรินทร์',   type:'สำนัก/สถาบัน', unit:'สำนักงานวิทยาเขตสุรินทร์' },
  { sheet:'สนง.วข.สน',   campus:'สกลนคร',    type:'สำนัก/สถาบัน', unit:'สำนักงานวิทยาเขตสกลนคร' },
  { sheet:'สอ',           campus:'นครราชสีมา', type:'สำนัก/สถาบัน', unit:'สำนักงานอธิการบดี' },
  { sheet:'สวท',          campus:'นครราชสีมา', type:'สำนัก/สถาบัน', unit:'สำนักส่งเสริมวิชาการและงานทะเบียน' },
  { sheet:'สวส',          campus:'นครราชสีมา', type:'สำนัก/สถาบัน', unit:'สำนักวิทยบริการและเทคโนโลยีสารสนเทศ' },
  { sheet:'สวพ',          campus:'นครราชสีมา', type:'สำนัก/สถาบัน', unit:'สถาบันวิจัยและพัฒนา' },
  { sheet:'สช',           campus:'นครราชสีมา', type:'สำนัก/สถาบัน', unit:'สถาบันบริการวิชาการและพัฒนาเอสเอ็มอีชุณหะวัณ' },
];
const SKIP_SHEETS = ['รวม', 'กราฟแยกคณะ'];
const CAMPUS_OPTIONS = ['นครราชสีมา','สุรินทร์','ขอนแก่น','สกลนคร','วิทยาเขตร้อยเอ็ด ณ ทุ่งกุลาร้องไห้'];
const TYPE_OPTIONS = ['คณะ','สำนัก/สถาบัน'];

let mappingData = [];
let workbook = null;
let resultData = null, resultAllData = null;

// ======= Load/Save Settings =======
function loadSettings() {
  try {
    const saved = localStorage.getItem('rmuti_mapping');
    if (saved) mappingData = JSON.parse(saved);
    else mappingData = [...DEFAULT_MAP.map(r => ({...r}))];

    const savedYear = localStorage.getItem('rmuti_year');
    if (savedYear) document.getElementById('year-input').value = savedYear;
  } catch(e) {
    mappingData = [...DEFAULT_MAP.map(r => ({...r}))];
  }
  renderMappingTable();
  updateYearDisplay();
}

function saveSettings() {
  try {
    readMappingFromTable();
    localStorage.setItem('rmuti_mapping', JSON.stringify(mappingData));
    localStorage.setItem('rmuti_year', document.getElementById('year-input').value);
    updateYearDisplay();
    const badge = document.getElementById('saved-badge');
    badge.style.display = 'inline-flex';
    setTimeout(() => badge.style.display = 'none', 2000);
  } catch(e) {}
}

function updateYearDisplay() {
  const y = document.getElementById('year-input').value;
  document.getElementById('output-filename').textContent = `data_source_${y}.xlsx`;
  document.getElementById('dl-name').textContent = `data_source_${y}.xlsx`;
  document.getElementById('al-year').textContent = y;
}

function resetMapping() {
  if (!confirm('Reset Mapping กลับเป็นค่าเริ่มต้น?')) return;
  mappingData = [...DEFAULT_MAP.map(r => ({...r}))];
  localStorage.setItem('rmuti_mapping', JSON.stringify(mappingData));
  renderMappingTable();
}

// ======= Mapping Table =======
function getMapping() {
  return Object.fromEntries(mappingData.map(r => [r.sheet, r]));
}

function renderMappingTable() {
  const tbody = document.getElementById('map-tbody');
  tbody.innerHTML = '';
  mappingData.forEach((row, i) => {
    const tr = document.createElement('tr');
    const campusOpts = CAMPUS_OPTIONS.map(c => `<option ${c===row.campus?'selected':''}>${c}</option>`).join('');
    const typeOpts = TYPE_OPTIONS.map(t => `<option ${t===row.type?'selected':''}>${t}</option>`).join('');
    tr.innerHTML = `
      <td><input type="text" value="${row.sheet}" onchange="updateRow(${i},'sheet',this.value); saveSettings();" placeholder="ชื่อ Sheet"></td>
      <td><select onchange="updateRow(${i},'campus',this.value); saveSettings();">${campusOpts}</select></td>
      <td><select onchange="updateRow(${i},'type',this.value); saveSettings();">${typeOpts}</select></td>
      <td><input type="text" value="${row.unit}" onchange="updateRow(${i},'unit',this.value); saveSettings();" placeholder="ชื่อหน่วยงานเต็ม"></td>
      <td><button class="btn-icon btn-del" onclick="deleteRow(${i})" title="ลบ">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById('map-count').textContent = `${mappingData.length} หน่วยงาน`;
}

function updateRow(i, key, val) { mappingData[i][key] = val; }

function readMappingFromTable() {
  // Values already updated via onchange
}

function addRow() {
  mappingData.push({ sheet:'', campus:'นครราชสีมา', type:'คณะ', unit:'' });
  renderMappingTable();
  saveSettings();
  // scroll to bottom
  document.getElementById('map-tbody').lastElementChild?.scrollIntoView({behavior:'smooth'});
}

function deleteRow(i) {
  if (!confirm(`ลบ Mapping "${mappingData[i].sheet}" ออก?`)) return;
  mappingData.splice(i, 1);
  renderMappingTable();
  saveSettings();
}

// ======= Tabs =======
function switchTab(t) {
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('tab-mapping').classList.toggle('section-hidden', t !== 'mapping');
  document.getElementById('tab-about').classList.toggle('section-hidden', t !== 'about');
}

// ======= File Upload =======
const fileInput = document.getElementById('file-input');
const uploadZone = document.getElementById('upload-zone');
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => { if(e.target.files[0]) handleFile(e.target.files[0]); });

function handleFile(file) {
  document.getElementById('fname').textContent = file.name;
  const reader = new FileReader();
  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    workbook = XLSX.read(data, { type:'array' });
    const sheets = workbook.SheetNames;
    const map = getMapping();
    const processable = sheets.filter(s => map[s]);
    const unmapped = sheets.filter(s => !map[s] && !SKIP_SHEETS.includes(s));
    const skipped = sheets.filter(s => SKIP_SHEETS.includes(s));

    document.getElementById('sheet-count').textContent = sheets.length;
    document.getElementById('process-count').textContent = processable.length;
    document.getElementById('unmapped-count').textContent = unmapped.length;

    const tagsEl = document.getElementById('sheet-tags');
    tagsEl.innerHTML = '';
    sheets.forEach(s => {
      const tag = document.createElement('span');
      if (map[s]) { tag.className = 'sheet-tag'; tag.title = map[s].unit; }
      else if (SKIP_SHEETS.includes(s)) { tag.className = 'sheet-tag skip'; tag.title = 'ข้าม'; }
      else { tag.className = 'sheet-tag unmapped'; tag.title = 'ไม่มีใน Mapping — จะข้ามไป'; }
      tag.textContent = s;
      tagsEl.appendChild(tag);
    });

    const unmapAlert = document.getElementById('unmapped-alert');
    if (unmapped.length > 0) {
      unmapAlert.className = 'alert alert-warn';
      unmapAlert.innerHTML = `⚠️ Sheet ที่ไม่มีใน Mapping (จะข้ามไป): <strong>${unmapped.join(', ')}</strong><br>ถ้าต้องการแปลง ให้ไปเพิ่มใน Mapping ด้านบนก่อน`;
      unmapAlert.classList.remove('section-hidden');
    } else {
      unmapAlert.classList.add('section-hidden');
    }

    uploadZone.classList.add('done');
    document.getElementById('file-info').classList.remove('section-hidden');
    document.getElementById('convert-section').classList.remove('section-hidden');

    const logEl = document.getElementById('log-box');
    logEl.innerHTML = '';
    appendLog(`✓ โหลดไฟล์ "${file.name}" สำเร็จ`, 'log-ok');
    appendLog(`  แปลงได้: ${processable.length} sheets | ข้าม: ${skipped.length + unmapped.length} sheets`, '');
  };
  reader.readAsArrayBuffer(file);
}

// ======= Log =======
const logEl = () => document.getElementById('log-box');
function appendLog(msg, cls='') {
  const el = logEl();
  const d = document.createElement('div');
  if (cls) d.className = cls;
  d.textContent = msg;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
}
function setProgress(pct, msg) {
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('status-msg').textContent = msg;
}

// ======= Parse one sheet =======
function parseSheet(sheetName, meta) {
  const ws = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json(ws, { header:1, defval:null });
  const rows = [];
  for (let i = 0; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row[1] === null || row[1] === undefined) continue;
    const kpiRaw = String(row[1]).trim().replace(/\s+/g,'');
    if (!/^\d+(\.\d+)+\*?$/.test(kpiRaw)) continue;
    const kpi = kpiRaw.replace(/\*$/, '');
    const kpiName = row[2] ? String(row[2]).trim().split('\n')[0].trim() : '';

    // handle col index differences — some sheets have extra col
    // col 3=target, col4=numerator, col5=denominator, col6=result, col7=summary
    const target = row[3];
    const result = row[6];
    const summary = row[7];

    let sumNorm = null;
    if (summary) {
      const s = String(summary).trim();
      if (s.includes('ไม่บรรลุ')) sumNorm = 'ไม่บรรลุเป้าหมาย';
      else if (s.includes('บรรลุ')) sumNorm = 'บรรลุเป้าหมาย';
    }

    const toNum = v => {
      if (v === null || v === undefined || v === '') return null;
      const n = parseFloat(String(v).replace(/,/g,''));
      return isNaN(n) ? v : n;
    };

    rows.push({
      วิทยาเขต: meta.campus,
      ประเภท: meta.type,
      หน่วยงาน: meta.unit,
      ตัวชี้วัด: kpi,
      ชื่อตัวชี้วัด: kpiName,
      เป้าหมาย: toNum(target),
      ผลลัพธ์: toNum(result),
      สรุปผล: sumNorm,
    });
  }
  return rows;
}

// ======= Parse "รวม" for "all" =======
function parseAllSheet() {
  const ws = workbook.Sheets['รวม'];
  if (!ws) return [];
  const raw = XLSX.utils.sheet_to_json(ws, { header:1, defval:null });
  const rows = [];
  for (let i = 0; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row[1] === null || row[1] === undefined) continue;
    const kpiRaw = String(row[1]).trim().replace(/\s+/g,'');
    if (!/^\d+(\.\d+)+\*?$/.test(kpiRaw)) continue;
    const kpi = kpiRaw.replace(/\*$/, '');
    const kpiName = row[2] ? String(row[2]).trim().split('\n')[0].trim() : '';
    const target = row[3]; const result = row[6]; const summary = row[7];
    const toNum = v => { if(!v && v!==0) return null; const n=parseFloat(String(v).replace(/,/g,'')); return isNaN(n)?v:n; };
    let sumNorm = null;
    if (summary) {
      const s = String(summary).trim();
      if (s.includes('ไม่บรรลุ')) sumNorm = 'ไม่บรรลุเป้าหมาย';
      else if (s.includes('บรรลุ')) sumNorm = 'บรรลุเป้าหมาย';
    }
    rows.push({ ตัวชี้วัด:kpi, ชื่อตัวชี้วัด:kpiName, เป้าหมาย:toNum(target), ผลลัพท์:toNum(result), สรุปผล:sumNorm });
  }
  return rows;
}

// ======= Convert =======
async function convertData() {
  if (!workbook) return;
  const btn = document.getElementById('convert-btn');
  btn.disabled = true;
  document.getElementById('log-box').innerHTML = '';
  setProgress(0, 'กำลังเริ่มต้น...');

  const map = getMapping();
  const sheets = workbook.SheetNames.filter(s => map[s]);
  const allRows = [];
  let okCount = 0, warnCount = 0;

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const meta = map[sheet];
    setProgress(Math.round((i / sheets.length) * 80), `กำลังอ่าน: ${sheet}`);
    await new Promise(r => setTimeout(r, 8));
    try {
      const rows = parseSheet(sheet, meta);
      if (rows.length === 0) { appendLog(`⚠ ${sheet} (${meta.unit}): ไม่พบข้อมูล`, 'log-warn'); warnCount++; }
      else { appendLog(`✓ ${sheet} → ${meta.unit}: ${rows.length} ตัวชี้วัด`, 'log-ok'); allRows.push(...rows); okCount++; }
    } catch(e) { appendLog(`✗ ${sheet}: ${e.message}`, 'log-err'); warnCount++; }
  }

  setProgress(88, 'อ่าน Sheet รวม...');
  await new Promise(r => setTimeout(r, 8));
  let allSheetRows = [];
  try {
    allSheetRows = parseAllSheet();
    appendLog(`✓ Sheet รวม: ${allSheetRows.length} ตัวชี้วัด (ภาพรวม)`, 'log-ok');
  } catch(e) { appendLog(`⚠ ไม่พบ Sheet รวม: ${e.message}`, 'log-warn'); }

  setProgress(97, 'สรุปผล...');
  await new Promise(r => setTimeout(r, 8));

  resultData = allRows;
  resultAllData = allSheetRows;

  const ok = allRows.filter(r => r.สรุปผล === 'บรรลุเป้าหมาย').length;
  const no = allRows.filter(r => r.สรุปผล === 'ไม่บรรลุเป้าหมาย').length;
  const na = allRows.filter(r => !r.สรุปผล).length;

  document.getElementById('r-data').textContent = allRows.length;
  document.getElementById('r-all').textContent = allSheetRows.length;
  document.getElementById('r-ok').textContent = ok;
  document.getElementById('r-no').textContent = no;
  document.getElementById('r-na').textContent = na;

  renderPreview(allRows.slice(0, 10));
  setProgress(100, `เสร็จสิ้น — ${okCount} หน่วยงาน, ${allRows.length} rows`);
  appendLog(`\n✓ แปลงสำเร็จ: ${okCount} หน่วยงาน | ${allRows.length} rows`, 'log-ok');
  if (warnCount > 0) appendLog(`⚠ คำเตือน: ${warnCount} sheets`, 'log-warn');

  document.getElementById('result-section').classList.remove('section-hidden');
  document.getElementById('result-section').scrollIntoView({ behavior:'smooth' });
  btn.disabled = false;
}

function renderPreview(rows) {
  const cols = ['วิทยาเขต','ประเภท','หน่วยงาน','ตัวชี้วัด','ชื่อตัวชี้วัด','เป้าหมาย','ผลลัพธ์','สรุปผล'];
  let h = '<table class="preview"><thead><tr>' + cols.map(c=>`<th>${c}</th>`).join('') + '</tr></thead><tbody>';
  rows.forEach(r => {
    h += '<tr>' + cols.map(c => {
      let v = r[c] ?? '';
      if (c === 'สรุปผล') {
        if (v === 'บรรลุเป้าหมาย') return `<td><span class="tag tag-ok">✓ บรรลุ</span></td>`;
        if (v === 'ไม่บรรลุเป้าหมาย') return `<td><span class="tag tag-no">✗ ไม่บรรลุ</span></td>`;
        return `<td><span class="tag tag-na">N/A</span></td>`;
      }
      if (c === 'ชื่อตัวชี้วัด') { const s=String(v); return `<td title="${s}">${s.length>45?s.slice(0,45)+'…':s}</td>`; }
      if (typeof v === 'number') return `<td>${v % 1 !== 0 ? v.toFixed(2) : v}</td>`;
      return `<td>${v}</td>`;
    }).join('') + '</tr>';
  });
  h += '</tbody></table>';
  document.getElementById('preview-table').innerHTML = h;
}

function downloadFile() {
  if (!resultData) return;
  const year = document.getElementById('year-input').value;
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(resultData, { header:['วิทยาเขต','ประเภท','หน่วยงาน','ตัวชี้วัด','ชื่อตัวชี้วัด','เป้าหมาย','ผลลัพธ์','สรุปผล'] });
  XLSX.utils.book_append_sheet(wb, ws1, `data${year}`);
  const ws2 = XLSX.utils.json_to_sheet(resultAllData.length > 0 ? resultAllData : [{}], { header:['ตัวชี้วัด','ชื่อตัวชี้วัด','เป้าหมาย','ผลลัพท์','สรุปผล'] });
  XLSX.utils.book_append_sheet(wb, ws2, 'all');
  XLSX.writeFile(wb, `data_source_${year}.xlsx`);
}

// ======= Init =======
loadSettings();
document.getElementById('year-input').addEventListener('input', updateYearDisplay);
