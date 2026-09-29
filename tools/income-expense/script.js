const MONTHS_FISCAL = ['ต.ค.','พ.ย.','ธ.ค.','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.'];
const REF_MONTH = [
 ['month_id','month_name','month_name_en','quarter_id'],
 [4,'มกราคม\u00A0','January','Q2'],[5,'กุมภาพันธ์\u00A0','February','Q2'],[6,'มีนาคม\u00A0','March','Q2'],
 [7,'เมษายน\u00A0','April','Q3'],[8,'พฤษภาคม\u00A0','May','Q3'],[9,'มิถุนายน\u00A0','June','Q3'],
 [10,'กรกฎาคม\u00A0','July','Q4'],[11,'สิงหาคม\u00A0','August','Q4'],[12,'กันยายน\u00A0','September','Q4'],
 [1,'ตุลาคม\u00A0','October','Q1'],[2,'พฤศจิกายน\u00A0','November','Q1'],[3,'ธันวาคม\u00A0','December','Q1'],
];
const REF_QUARTER = [
 ['quarter_id','quarter_name','quarter_more'],
 ['Q1','ไตรมาสที่ 1','(ตุลาคม - ธันวาคม)'],['Q2','ไตรมาสที่ 2',' (มกราคม - มีนาคม)'],
 ['Q3','ไตรมาสที่ 3',' (เมษายน - มิถุนายน)'],['Q4','ไตรมาสที่ 4',' (กรกฏาคม - กันยายน)'],
];
// known shorthand for revenue-source rows that have no sub-items of their own (leaf at top level)
const INCOME_CATEGORY_SHORTHAND = { 'เงินออมจากการจัดการศึกษา':'เงินออม' };
// expense sheet-name -> ประเภทรายจ่าย ; sheets whose name doesn't match anything here are skipped
const PAY_SHEET_MAP = [
 [/การจัดการเรียนการสอน/, 'การจัดการเรียนการสอน'],
 [/หอพัก/, 'หอพัก'],
 [/งานวิจัยและบริการวิชาการ/, 'งานวิจัยและบริการวิชาการ'],
 [/งานฟาร์ม/, 'งานฟาร์ม'],
 [/ค่าเช่าอสังหา/, 'รายได้ค่าเช่าอสังหาริมทรัพย์'],
 [/รายได้อื่นๆ/, 'รายได้อื่นๆ'],
 [/แพทย์แผนไทย/, 'โรงพยาบาลแพทย์แผนไทย'],
];

let incWB=null, payWB=null, result=null;

function log(msg, cls){
  const el=document.getElementById('log');
  document.getElementById('logWrap').classList.remove('hidden');
  const line=document.createElement('div');
  if(cls) line.className=cls;
  line.textContent=msg;
  el.appendChild(line);
  el.scrollTop=el.scrollHeight;
}
function stripWS(s){ return (s||'').replace(/\s+/g,''); }
function num(v){ return (typeof v==='number' && !isNaN(v)) ? v : 0; }

function findMonthHeader(rows){
  for(let r=0;r<rows.length;r++){
    const row=rows[r]||[];
    const found={};
    for(let c=0;c<row.length;c++){
      const t=(row[c]==null)?'':String(row[c]).trim();
      const idx=MONTHS_FISCAL.indexOf(t);
      if(idx>=0) found[idx]=c;
    }
    if(Object.keys(found).length>=10){
      const cols=[];
      for(let i=0;i<12;i++) cols.push(found[i]);
      return {headerRow:r, dataStart:r+2, monthCols:cols};
    }
  }
  return null;
}

function parseWideSheet(rows){
  const hdr=findMonthHeader(rows);
  if(!hdr) return null;
  const out=[];
  for(let r=hdr.dataStart; r<rows.length; r++){
    const row=rows[r]||[];
    const rawLabel=row[0];
    if(rawLabel==null || String(rawLabel).trim()==='') continue; // skip spacer rows, keep scanning
    out.push({raw:String(rawLabel), row});
  }
  return {items:out, monthCols:hdr.monthCols};
}

function monthValues(row, monthCols){
  // returns array of 12 {plan, actual}
  return monthCols.map(c=>({plan:num(row[c]), actual:num(row[c+1])}));
}

function processIncome(rows, warnings){
  const parsed=parseWideSheet(rows);
  if(!parsed){ warnings.push(['e','ไม่พบหัวตารางเดือน (ต.ค. ... ก.ย.) ในไฟล์รายรับ']); return []; }
  const {items, monthCols}=parsed;
  // level0: no leading whitespace, matches ^(\d+)\.\s*(.+)$
  // level1: leading whitespace, trimmed matches ^(\d+)\.(\d+)\s+(.+)$
  const level0={}; // num -> {text, row}
  const level1ByParent={}; // num -> [ {num2, text, row} ]
  for(const it of items){
    const raw=it.raw;
    const leading = /^\s/.test(raw);
    const trimmed = raw.trim();
    if(!leading){
      const m=trimmed.match(/^(\d+)\.\s*(.+)$/);
      if(m) level0[m[1]]={text:m[2], row:it.row};
    } else {
      const m=trimmed.match(/^(\d+)\.(\d+)\s+(.+)$/);
      if(m){
        (level1ByParent[m[1]] = level1ByParent[m[1]]||[]).push({text:m[3], row:it.row});
      }
    }
  }
  const outRows=[];
  for(const num0 in level0){
    const children = level1ByParent[num0];
    const parentText = stripWS(level0[num0].text);
    if(children && children.length){
      for(const ch of children){
        const name = stripWS(ch.text);
        const vals = monthValues(ch.row, monthCols);
        vals.forEach((v,i)=>{
          const month_id=i+1, quarter_id=Math.ceil(month_id/3);
          outRows.push([name, parentText, month_id, quarter_id, v.plan, v.actual]);
        });
      }
    } else {
      // orphan leaf: the level0 row itself is the data row
      const name = parentText;
      const category = INCOME_CATEGORY_SHORTHAND[name] || name;
      const vals = monthValues(level0[num0].row, monthCols);
      vals.forEach((v,i)=>{
        const month_id=i+1, quarter_id=Math.ceil(month_id/3);
        outRows.push([name, category, month_id, quarter_id, v.plan, v.actual]);
      });
      warnings.push(['ok', `รายได้ "${name}" ไม่มีรายการย่อย ใช้เป็นแหล่งที่มาโดยตรง (ประเภทรายได้ = "${category}")`]);
    }
  }
  return outRows;
}

function mapPaySheetName(name){
  for(const [re,label] of PAY_SHEET_MAP) if(re.test(name)) return label;
  return null;
}

function processPay(workbook, warnings){
  const outRows=[];
  for(const sheetName of workbook.SheetNames){
    const label = mapPaySheetName(sheetName);
    if(!label){ warnings.push(['w', `ข้ามชีท "${sheetName}" (ไม่ตรงกับ 6 ประเภทรายจ่ายมาตรฐาน)`]); continue; }
    const ws=workbook.Sheets[sheetName];
    const rows=XLSX.utils.sheet_to_json(ws,{header:1, raw:true, defval:null});
    const parsed=parseWideSheet(rows);
    if(!parsed){ warnings.push(['e', `ชีท "${sheetName}": ไม่พบหัวตารางเดือน`]); continue; }
    const {items, monthCols}=parsed;
    let count=0;
    for(const it of items){
      const raw=it.raw;
      if(/^\s/.test(raw)) continue; // only top-level (no leading whitespace) rows
      const m=raw.trim().match(/^(\d+)\.\s*(.+)$/);
      if(!m) continue;
      let text=m[2].replace(/\(.*?\)\s*$/,'').trim();
      text=stripWS(text);
      const vals=monthValues(it.row, monthCols);
      vals.forEach((v,i)=>{
        const month_id=i+1, quarter_id=Math.ceil(month_id/3);
        outRows.push([label, text, month_id, quarter_id, v.plan, v.actual]);
      });
      count++;
    }
    if(count!==6) warnings.push(['w', `ชีท "${sheetName}" -> "${label}": พบ ${count} ประเภทงบ (คาดไว้ 6)`]);
    else warnings.push(['ok', `ชีท "${sheetName}" -> ประเภทรายจ่าย "${label}": OK (6 ประเภทงบ x 12 เดือน)`]);
  }
  return outRows;
}

function buildWorkbook(incomeRows, payRows){
  const wb=XLSX.utils.book_new();
  const incAoA=[['แหล่งที่มารายได้','ประเภทรายได้','month_id','quarter_id','ประมาณการ','รายรับจริง'], ...incomeRows];
  const payAoA=[['ประเภทรายจ่าย','ประเภทงบ','month_id','quarter_id','ประมาณการ','รายรับจริง'], ...payRows];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(incAoA), 'income');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(payAoA), 'pay');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(REF_MONTH), 'ref_month');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(REF_QUARTER), 'ref_quarter');
  return wb;
}

function defaultFilename(){
  const d=new Date();
  const beYear=d.getFullYear()+543;
  const dd=String(d.getDate()).padStart(2,'0');
  const mm=String(d.getMonth()+1).padStart(2,'0');
  const yy=String(beYear).slice(-2);
  return `pay_income_Source_${beYear}_${dd}-${mm}-${yy}.xlsx`;
}

function wireDrop(dropId, inputId, nameId, onFile){
  const drop=document.getElementById(dropId), input=document.getElementById(inputId), nm=document.getElementById(nameId);
  input.addEventListener('change', async ()=>{
    const f=input.files[0]; if(!f) return;
    nm.textContent='กำลังอ่านไฟล์ "'+f.name+'" ...'; nm.classList.remove('ok');
    try{
      const buf=await f.arrayBuffer();
      const wb=XLSX.read(buf,{type:'array'});
      onFile(wb, f.name);
      nm.textContent='✓ '+f.name+' ('+wb.SheetNames.length+' ชีท)';
      nm.classList.add('ok');
    }catch(e){
      nm.textContent='อ่านไฟล์ไม่สำเร็จ: '+e.message;
    }
    checkReady();
  });
}
function checkReady(){
  document.getElementById('btnConvert').disabled = !(incWB && payWB);
}
wireDrop('dropIncome','fileIncome','nameIncome', wb=>{ incWB=wb; });
wireDrop('dropPay','filePay','namePay', wb=>{ payWB=wb; });

document.getElementById('btnConvert').addEventListener('click', ()=>{
  document.getElementById('log').innerHTML='';
  document.getElementById('resultCard').classList.add('hidden');
  const warnings=[];
  const incSheetRows = XLSX.utils.sheet_to_json(incWB.Sheets[incWB.SheetNames[0]], {header:1, raw:true, defval:null});
  const incomeRows = processIncome(incSheetRows, warnings);
  const payRows = processPay(payWB, warnings);
  warnings.forEach(([cls,msg])=>log(msg, cls==='e'?'e':cls==='w'?'w':'ok'));
  log(`สรุป: income ${incomeRows.length} แถว, pay ${payRows.length} แถว`, 'ok');

  result = buildWorkbook(incomeRows, payRows);
  document.getElementById('summary').innerHTML = `
    <div class="stat"><b>${incomeRows.length}</b><span>แถว income (${incomeRows.length/12} แหล่งที่มา × 12 เดือน)</span></div>
    <div class="stat"><b>${payRows.length}</b><span>แถว pay (${payRows.length/72} ประเภทรายจ่าย × 6 งบ × 12 เดือน)</span></div>
    <div class="stat"><b>${warnings.filter(w=>w[0]!=='ok').length}</b><span>คำเตือน</span></div>
  `;
  const previewRows = incomeRows.slice(0,8);
  const tbl=document.getElementById('previewTable');
  tbl.innerHTML = '<tr><th>แหล่งที่มารายได้</th><th>ประเภทรายได้</th><th>month_id</th><th>quarter_id</th><th>ประมาณการ</th><th>รายรับจริง</th></tr>' +
    previewRows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
  document.getElementById('resultCard').classList.remove('hidden');
});

document.getElementById('btnDownload').addEventListener('click', async ()=>{
  if(!result) return;
  const arrbuf = XLSX.write(result, {type:'array', bookType:'xlsx'});
  const btn=document.getElementById('btnDownload');
  const downloads = (window.claude && window.claude.use) ? await window.claude.use('downloads') : null;
  const filename = defaultFilename();
  if(downloads){
    try{
      await downloads.save({filename, data: arrbuf});
    }catch(e){
      btn.textContent = 'บันทึกไม่สำเร็จ: '+(e && e.code || e.message || e);
      setTimeout(()=>btn.textContent='ดาวน์โหลดไฟล์ .xlsx',2500);
    }
  } else {
    // fallback (non-artifact context): trigger a normal browser download
    const blob=new Blob([arrbuf], {type:'application/octet-stream'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
});
