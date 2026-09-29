// ============================================================
// CONFIG
// ============================================================
const CAMPUS_MAP = {'นม.':19901,'สร.':19902,'ขก.':19903,'สน.':19905};

const MONTH_COL = {
  1:[2,'Q1'], 2:[3,'Q1'], 3:[5,'Q1'],
  4:[8,'Q2'], 5:[10,'Q2'], 6:[12,'Q2'],
  7:[15,'Q3'], 8:[17,'Q3'], 9:[19,'Q3'],
  10:[22,'Q4'], 11:[24,'Q4'], 12:[26,'Q4'],
};
const Q_LAST = {Q1:3,Q2:6,Q3:9,Q4:12};
const Q_COL = {
  19901:{Q1:7,Q2:8,Q3:9,Q4:10},
  19902:{Q1:12,Q2:13,Q3:14,Q4:15},
  19903:{Q1:17,Q2:18,Q3:19,Q4:20},
  19905:{Q1:22,Q2:23,Q3:24,Q4:25},
};

// ============================================================
// REF DATA
// ============================================================
const REF_QUARTER = [
  {quarter_id:'Q1',quarter_name:'ไตรมาสที่ 1',quarter_more:'(ตุลาคม - ธันวาคม)'},
  {quarter_id:'Q2',quarter_name:'ไตรมาสที่ 2',quarter_more:'(มกราคม - มีนาคม)'},
  {quarter_id:'Q3',quarter_name:'ไตรมาสที่ 3',quarter_more:'(เมษายน - มิถุนายน)'},
  {quarter_id:'Q4',quarter_name:'ไตรมาสที่ 4',quarter_more:'(กรกฎาคม - กันยายน)'},
];
const REF_MONTH = [
  {month_id:1, month_name:'ตุลาคม',    month_name_en:'October'},
  {month_id:2, month_name:'พฤศจิกายน', month_name_en:'November'},
  {month_id:3, month_name:'ธันวาคม',   month_name_en:'December'},
  {month_id:4, month_name:'มกราคม',    month_name_en:'January'},
  {month_id:5, month_name:'กุมภาพันธ์',month_name_en:'February'},
  {month_id:6, month_name:'มีนาคม',    month_name_en:'March'},
  {month_id:7, month_name:'เมษายน',    month_name_en:'April'},
  {month_id:8, month_name:'พฤษภาคม',  month_name_en:'May'},
  {month_id:9, month_name:'มิถุนายน',  month_name_en:'June'},
  {month_id:10,month_name:'กรกฎาคม',  month_name_en:'July'},
  {month_id:11,month_name:'สิงหาคม',  month_name_en:'August'},
  {month_id:12,month_name:'กันยายน',  month_name_en:'September'},
];
const REF_BUDGET = [
  {budget_id:1100,budget_group_id:1000,budget_name:'เงินเดือนและค่าจ้างประจำ'},
  {budget_id:1200,budget_group_id:1000,budget_name:'ค่าตอบแทนพนักงานราชการ'},
  {budget_id:2100,budget_group_id:2000,budget_name:'ค่าตอบแทน ใช้สอยและวัสดุ'},
  {budget_id:3100,budget_group_id:3000,budget_name:'ครุภัณฑ์'},
  {budget_id:3200,budget_group_id:3000,budget_name:'ที่ดินและสิ่งก่อสร้าง'},
  {budget_id:4000,budget_group_id:4000,budget_name:'งบอุดหนุน'},
  {budget_id:4100,budget_group_id:4000,budget_name:'ค่าตอบแทน ใช้สอยและวัสดุ'},
  {budget_id:4200,budget_group_id:4000,budget_name:'ค่าสาธารณูปโภค'},
  {budget_id:4300,budget_group_id:4000,budget_name:'โครงการอนุรักษ์พันธุกรรมพืชฯ'},
  // section 4 (โครงการสนับสนุนฯ) sub-items
  {budget_id:5100,budget_group_id:5000,budget_name:'ค่าจัดการเรียนการสอน'},
  {budget_id:5200,budget_group_id:5000,budget_name:'ค่าหนังสือเรียน'},
  {budget_id:5300,budget_group_id:5000,budget_name:'ค่าอุปกรณ์การเรียน'},
  {budget_id:5400,budget_group_id:5000,budget_name:'ค่าเครื่องแบบนักเรียน'},
  {budget_id:5500,budget_group_id:5000,budget_name:'ค่ากิจกรรมพัฒนาคุณภาพผู้เรียน'},
];
const REF_GROUP = [
  {budget_group_id:1000,budget_group_name:'งบบุคลากร'},
  {budget_group_id:2000,budget_group_name:'งบดำเนินงาน'},
  {budget_group_id:3000,budget_group_name:'งบลงทุน'},
  {budget_group_id:4000,budget_group_name:'งบอุดหนุน'},
  {budget_group_id:5000,budget_group_name:'โครงการสนับสนุนค่าใช้จ่ายในการจัดการศึกษา'},
];
const REF_CAMPUS = [
  {campus_id:19901,campus_name:'นครราชสีมา'},
  {campus_id:19902,campus_name:'วิทยาเขตสุรินทร์'},
  {campus_id:19903,campus_name:'วิทยาเขตขอนแก่น'},
  {campus_id:19905,campus_name:'วิทยาเขตสกลนคร'},
];
const REF_BUDGET_TYPE = [
  {budget_type_id:0,budget_type_name:'รายการบุคลากรภาครัฐ'},
  {budget_type_id:1,budget_type_name:'ผลผลิต : ผู้สำเร็จการศึกษาด้านวิทยาศาสตร์ฯ'},
  {budget_type_id:2,budget_type_name:'ผลผลิต : ผู้สำเร็จการศึกษาด้านสังคมศาสตร์'},
  {budget_type_id:3,budget_type_name:'ผลผลิต : การพัฒนาศักยภาพกำลังคนสมรรถนะสูง'},
  {budget_type_id:4,budget_type_name:'โครงการสนับสนุนค่าใช้จ่ายในการจัดการศึกษาตั้งแต่ระดับอนุบาลจนจบการศึกษาขั้นพื้นฐาน'},
];

// ============================================================
// ETL LOGIC
// ============================================================
const safeNum = v => {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  const s = String(v).trim();
  if (s.startsWith('=') || s === '-' || s === '') return 0;
  return parseFloat(s.replace(/,/g,'')) || 0;
};

const identifySection = label => {
  if (!label) return null;
  const s = String(label);
  if (s.includes('รายการบุคลากรภาครัฐ'))                          return 0;
  if (s.includes('วิทยาศาสตร์') && s.includes('สำเร็จการศึกษา'))  return 1;
  if (s.includes('สังคมศาสตร์') && s.includes('สำเร็จการศึกษา'))  return 2;
  if (s.includes('กำลังคนสมรรถนะสูง'))                            return 3;
  if (s.includes('สนับสนุนค่าใช้จ่ายในการจัดการศึกษา'))          return 4;
  return null;
};

// map label → [[budget_id, budget_group_id, budget_type_id], ...]
const identifyBudget = (label, sect) => {
  if (!label) return [];
  const s = String(label).trim();

  // ── section 0: บุคลากรภาครัฐ ────────────────────────────
  if (s.includes('1.1') && s.includes('เงินเดือนและค่าจ้างประจำ') && sect===0) return [[1100,1000,0]];
  if (s.includes('1.2') && s.includes('ค่าตอบแทนพนักงานราชการ')   && sect===0) return [[1200,1000,0]];
  if (s.includes('2.1') && s.includes('ค่าตอบแทน ใช้สอยและวัสดุ') && sect===0) return [[2100,2000,0]];

  // ── งบลงทุน (sections 1–4) ──────────────────────────────
  if (s.includes('3.1') && s.includes('ครุภัณฑ์')              && [1,2,3,4].includes(sect)) return [[3100,3000,sect]];
  if (s.includes('3.2') && s.includes('ที่ดินและสิ่งก่อสร้าง') && [1,2,3,4].includes(sect)) return [[3200,3000,sect]];

  // ── งบอุดหนุน หัวข้อรวม ─────────────────────────────────
  if (/^4\.\s/.test(s) && s.includes('งบเงินอุดหนุน')) {
    if (sect===0) return [[4000,4000,0]];
    if (sect===3) return [[4000,4000,3]];
    // sect===4: ไม่ map 4000 ที่นี่ เพราะ sub-items 5100-5500 รับ budget_sum แล้ว
  }

  // ── section 1 & 2: sub-items งบอุดหนุน ──────────────────
  if (s.includes('4.1') && s.includes('ค่าตอบแทน ใช้สอยและวัสดุ') && [1,2].includes(sect)) return [[4100,4000,sect]];
  // แก้ไข: ค่าสาธารณูปโภค รองรับทั้ง section 1 และ 2
  if (s.includes('ค่าสาธารณูปโภค') && !s.includes('4.') && [1,2].includes(sect)) return [[4200,4000,sect]];
  if (s.includes('อนุรักษ์พันธุกรรมพืช') && sect===1) return [[4300,4000,1]];

  // ── section 4: โครงการสนับสนุนฯ sub-items ───────────────
  if (sect===4) {
    if (s.includes('ค่าจัดการเรียนการสอน'))          return [[5100,5000,4]];
    if (s.includes('ค่าหนังสือเรียน'))               return [[5200,5000,4]];
    if (s.includes('ค่าอุปกรณ์การเรียน'))            return [[5300,5000,4]];
    if (s.includes('ค่าเครื่องแบบนักเรียน'))         return [[5400,5000,4]];
    if (s.includes('ค่ากิจกรรมพัฒนาคุณภาพผู้เรียน')) return [[5500,5000,4]];
  }

  return [];
};

// ============================================================
// STATE & UI
// ============================================================
let wb = null, allRecords = [];
const $ = id => document.getElementById(id);

$('fi').addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
$('dropZone').addEventListener('dragover', e => { e.preventDefault(); $('dropZone').classList.add('drag'); });
$('dropZone').addEventListener('dragleave', () => $('dropZone').classList.remove('drag'));
$('dropZone').addEventListener('drop', e => {
  e.preventDefault(); $('dropZone').classList.remove('drag');
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      wb = XLSX.read(e.target.result, {type:'array', cellFormula:false});
      $('fileLabel').textContent = file.name + ' — ' + wb.SheetNames.length + ' sheets';
      $('filePill').classList.remove('hidden');
      showSheetCheck();
    } catch(err) { alert('ไม่สามารถอ่านไฟล์ได้: ' + err.message); }
  };
  reader.readAsArrayBuffer(file);
}

function showSheetCheck() {
  const required = ['แยกไตรมาส','นม.','สร.','ขก.','สน.'];
  const list = $('sheetList');
  list.innerHTML = '';
  required.forEach(s => {
    const has = wb.SheetNames.includes(s);
    const el = document.createElement('span');
    el.className = 'badge ' + (has ? 'badge-ok' : 'badge-warn');
    el.innerHTML = `<i class="ti ti-${has?'check':'alert-triangle'}"></i> ${s}`;
    list.appendChild(el);
  });
  $('sheetCheck').classList.remove('hidden');
}

function setStep(n) {
  ['step1','step2','step3'].forEach((id,i) => $(id).classList.toggle('hidden', i+1!==n));
  ['s1','s2','s3'].forEach((id,i) => {
    const el = $(id);
    el.classList.remove('active','done');
    if (i+1===n) el.classList.add('active');
    else if (i+1<n) el.classList.add('done');
  });
}

function log(msg, type='') {
  const box = $('logBox');
  const line = document.createElement('div');
  line.className = type; line.textContent = msg;
  box.appendChild(line); box.scrollTop = box.scrollHeight;
}
function setProgress(pct, label) {
  $('progFill').style.width = pct + '%';
  $('progPct').textContent = pct + '%';
  if (label) $('progLabel').textContent = label;
}

// ============================================================
// MAIN ETL
// ============================================================
async function startETL() {
  setStep(2); allRecords = [];
  await delay(50);

  log('เริ่ม ETL...', 'info');
  setProgress(5, 'อ่านแผนรายไตรมาส (แยกไตรมาส)...');
  await delay(30);

  // โหลด quarterly budget จาก sheet "แยกไตรมาส"
  const qRows = sheetToRows('แยกไตรมาส');
  const qBudget = {};
  let curSect = null;
  for (let i = 4; i < qRows.length; i++) {
    const row = qRows[i];
    const s = identifySection(row[0]);
    if (s !== null) { curSect = s; continue; }
    identifyBudget(row[0], curSect).forEach(([bid, bgid, btid]) => {
      Object.entries(Q_COL).forEach(([campusId, qcols]) => {
        Object.entries(qcols).forEach(([qid, col]) => {
          qBudget[`${bid}_${bgid}_${btid}_${campusId}_${qid}`] = safeNum(row[col]);
        });
      });
    });
  }
  log(`  แผนรายไตรมาส: ${Object.keys(qBudget).length} รายการ`, 'ok');
  setProgress(20, 'ประมวลผลแต่ละวิทยาเขต...');
  await delay(30);

  const campuses = Object.entries(CAMPUS_MAP);
  for (let ci = 0; ci < campuses.length; ci++) {
    const [sheetName, campusId] = campuses[ci];
    if (!wb.SheetNames.includes(sheetName)) {
      log(`  ข้าม ${sheetName} (ไม่พบ Sheet)`, 'err'); continue;
    }
    const rows = sheetToRows(sheetName);
    let sect = null;
    const seen = new Set();

    const addRec = (bid, bgid, btid, mId, qId, pay, bsum) => {
      const k = `${campusId}_${bid}_${bgid}_${btid}_${qId}_${mId}`;
      if (seen.has(k)) return;
      seen.add(k);
      allRecords.push({campus_id:campusId, budget_id:bid,
        budget_group_id:bgid, budget_type_id:btid,
        quarter_id:qId, month_id:mId, budget_sum:bsum, pay_sum:pay});
    };

    for (let i = 4; i < rows.length; i++) {
      const row = rows[i];
      const s = identifySection(row[0]);
      if (s !== null) { sect = s; continue; }
      identifyBudget(row[0], sect).forEach(([bid, bgid, btid]) => {
        Object.entries(MONTH_COL).forEach(([mId, [pCol, qId]]) => {
          const pay = safeNum(row[pCol]);
          const isLast = Q_LAST[qId] === Number(mId);
          const bsum = isLast ? (qBudget[`${bid}_${bgid}_${btid}_${campusId}_${qId}`]||0) : 0;
          addRec(bid, bgid, btid, Number(mId), qId, pay, bsum);
        });
      });
    }

    // Ensure type=4 always has 3100 & 3200 rows
    [[3100,3000],[3200,3000]].forEach(([bid,bgid]) => {
      Object.entries(MONTH_COL).forEach(([mId,[,qId]]) => {
        const isLast = Q_LAST[qId]===Number(mId);
        const bsum = isLast ? (qBudget[`${bid}_${bgid}_4_${campusId}_${qId}`]||0) : 0;
        addRec(bid, bgid, 4, Number(mId), qId, 0, bsum);
      });
    });
    // Ensure type=3 always has 4000 row
    Object.entries(MONTH_COL).forEach(([mId,[,qId]]) => {
      const isLast = Q_LAST[qId]===Number(mId);
      const bsum = isLast ? (qBudget[`4000_4000_3_${campusId}_${qId}`]||0) : 0;
      addRec(4000, 4000, 3, Number(mId), qId, 0, bsum);
    });

    log(`  ${sheetName} (campus ${campusId}): ${seen.size} records`, 'ok');
    setProgress(20+((ci+1)/campuses.length)*70, `ประมวลผล ${sheetName}...`);
    await delay(30);
  }

  log(`รวมทั้งหมด: ${allRecords.length} records`, 'info');
  setProgress(100, 'เสร็จสิ้น!');
  await delay(300);
  showResult();
  setStep(3);
}

function sheetToRows(name) {
  return XLSX.utils.sheet_to_json(wb.Sheets[name], {header:1, defval:null, raw:true});
}
const delay = ms => new Promise(r => setTimeout(r, ms));

// ============================================================
// RESULT
// ============================================================
function showResult() {
  const campuses = [...new Set(allRecords.map(r => r.campus_id))];
  const months = [...new Set(allRecords.filter(r => r.pay_sum!==0).map(r => r.month_id))];
  const totalBudget = allRecords.reduce((s,r) => s+r.budget_sum, 0);
  $('statsGrid').innerHTML = `
    <div class="stat"><div class="stat-label">Records ทั้งหมด</div><div class="stat-val">${allRecords.length.toLocaleString()}</div></div>
    <div class="stat"><div class="stat-label">วิทยาเขต</div><div class="stat-val">${campuses.length}</div></div>
    <div class="stat"><div class="stat-label">เดือนที่มีข้อมูล</div><div class="stat-val">${months.length}</div></div>
    <div class="stat"><div class="stat-label">งบฯ รวม (ล้าน)</div><div class="stat-val">${(totalBudget/1e6).toFixed(1)}</div></div>
  `;
  $('refDataCount').textContent = allRecords.length.toLocaleString() + ' records';
  const headers = ['campus_id','budget_id','budget_group_id','budget_type_id','quarter_id','month_id','budget_sum','pay_sum'];
  let html = '<thead><tr>'+headers.map(h=>`<th>${h}</th>`).join('')+'</tr></thead><tbody>';
  allRecords.slice(0,15).forEach(r => {
    html += '<tr>'+headers.map(h=>`<td>${r[h]??''}</td>`).join('')+'</tr>';
  });
  $('previewTbl').innerHTML = html + '</tbody>';
  $('previewNote').textContent = `แสดง 15 จาก ${allRecords.length} แถว`;

  // ตั้งชื่อไฟล์ default พร้อมวันที่
  const d = new Date();
  const ts = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  $('exportFilename').value = `Data_source_bi_2569_${ts}`;
  updateFilenamePreview();
}

// ============================================================
// EXPORT
// ============================================================
function buildWorkbook() {
  const out = XLSX.utils.book_new();
  const mainH = ['campus_id','budget_id','budget_group_id','budget_type_id','quarter_id','month_id','budget_sum','pay_sum'];
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(allRecords,{header:mainH}), 'Data_soure');
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(REF_QUARTER,{header:['quarter_id','quarter_name','quarter_more']}), 'REF_Quarter');
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(REF_MONTH,{header:['month_id','month_name','month_name_en']}), 'REF_Month');
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(REF_BUDGET,{header:['budget_id','budget_group_id','budget_name']}), 'REF_budget');
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(REF_GROUP,{header:['budget_group_id','budget_group_name']}), 'REF_group');
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(REF_CAMPUS,{header:['campus_id','campus_name']}), 'REF_campus');
  XLSX.utils.book_append_sheet(out, XLSX.utils.json_to_sheet(REF_BUDGET_TYPE,{header:['budget_type_id','budget_type_name']}), 'REF_budget_type');
  return out;
}

function updateFilenamePreview() {
  const name = ($('exportFilename').value || 'Data_source_bi_2569').trim();
  $('filenamePreview').textContent = `ตัวอย่าง: ${name}.xlsx  /  ${name}.zip`;
}
$('exportFilename') && $('exportFilename').addEventListener('input', updateFilenamePreview);

async function doExport(type) {
  if (!allRecords.length) { alert('ไม่มีข้อมูล'); return; }
  if (type === 'xlsx') {
    const fname = ($('exportFilename').value || 'Data_source_bi_2569').trim() || 'Data_source_bi_2569';
    XLSX.writeFile(buildWorkbook(), `${fname}.xlsx`);
    showToast(`Export เสร็จ: ${fname}.xlsx (7 sheets)`);
  } else {
    const zip = new JSZip();
    const folder = zip.folder(`Data_source_bi_2569_${ts}`);
    const sheets = [
      {name:'Data_soure',     data:allRecords,      headers:['campus_id','budget_id','budget_group_id','budget_type_id','quarter_id','month_id','budget_sum','pay_sum']},
      {name:'REF_Quarter',    data:REF_QUARTER,      headers:['quarter_id','quarter_name','quarter_more']},
      {name:'REF_Month',      data:REF_MONTH,        headers:['month_id','month_name','month_name_en']},
      {name:'REF_budget',     data:REF_BUDGET,       headers:['budget_id','budget_group_id','budget_name']},
      {name:'REF_group',      data:REF_GROUP,        headers:['budget_group_id','budget_group_name']},
      {name:'REF_campus',     data:REF_CAMPUS,       headers:['campus_id','campus_name']},
      {name:'REF_budget_type',data:REF_BUDGET_TYPE,  headers:['budget_type_id','budget_type_name']},
    ];
    sheets.forEach(({name,data,headers}) => {
      const wb2 = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb2, XLSX.utils.json_to_sheet(data,{header:headers}), name);
      folder.file(`${name}.csv`, '\uFEFF' + XLSX.utils.sheet_to_csv(wb2.Sheets[name]));
    });
    const blob = await zip.generateAsync({type:'blob'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const fnameCsv = ($('exportFilename').value || 'Data_source_bi_2569').trim() || 'Data_source_bi_2569';
    a.href = url; a.download = `${fnameCsv}.zip`;
    a.click(); URL.revokeObjectURL(url);
    showToast(`Export เสร็จ: ${fnameCsv}.zip (7 CSV files)`);
  }
}

function resetAll() {
  wb = null; allRecords = [];
  $('fi').value = '';
  $('filePill').classList.add('hidden');
  $('sheetCheck').classList.add('hidden');
  $('logBox').innerHTML = '';
  setProgress(0,'');
  setStep(1);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<i class="ti ti-circle-check"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}
